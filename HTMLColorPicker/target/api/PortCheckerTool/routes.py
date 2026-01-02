# Module imports
import azure.functions as func
import json
import dns.resolver
import dns.exception
import requests
import whois

# Port checker imports
import socket
import time
import ipaddress

# Function settings

def register(app: 'func.FunctionApp'):
    def record_not_found(record_type, domain):
        return f"{record_type} record not found: {domain}"

    @app.route(route="PortCheckerTool/portcheck")
    def port_check(req: func.HttpRequest) -> func.HttpResponse:
        host = (req.params.get("host") or "").strip()
        port_raw = (req.params.get("port") or "").strip()
        timeout_raw = (req.params.get("timeout") or "").strip()

        if not host:
            return func.HttpResponse("Please pass a host (IP or hostname) on the query string", status_code=400)
        if not port_raw:
            return func.HttpResponse("Please pass a port on the query string", status_code=400)

        try:
            port = int(port_raw)
            if port < 1 or port > 65535:
                raise ValueError()
        except ValueError:
            return func.HttpResponse("Port must be an integer between 1 and 65535", status_code=400)

        try:
            timeout_sec = float(timeout_raw) if timeout_raw else 3.0
            if timeout_sec <= 0 or timeout_sec > 15:
                timeout_sec = 3.0
        except ValueError:
            timeout_sec = 3.0

        ips = [host] if _is_ip_literal(host) else _resolve_host_to_ips(host)

        if not ips:
            return func.HttpResponse(
                json.dumps({"ok": False, "host": host, "port": port, "error": "Unable to resolve hostname", "resolved_ips": []}),
                mimetype="application/json",
                status_code=200
            )

        allowed_ips = []
        blocked = []
        for ip in ips:
            allowed, reason = _is_ip_allowed(ip)
            if allowed:
                allowed_ips.append(ip)
            else:
                blocked.append({"ip": ip, "reason": reason})

        if not allowed_ips:
            return func.HttpResponse(
                json.dumps({"ok": False, "host": host, "port": port, "error": "All resolved IPs are blocked", "resolved_ips": ips, "blocked": blocked}),
                mimetype="application/json",
                status_code=200
            )

        attempts = []
        for ip in allowed_ips:
            is_open, latency_ms, err = _tcp_connect(ip, port, timeout_sec)
            attempts.append({"ip": ip, "open": is_open, "latency_ms": latency_ms, "error": err if not is_open else ""})
            if is_open:
                return func.HttpResponse(
                    json.dumps({"ok": True, "host": host, "port": port, "open": True, "timeout_sec": timeout_sec, "resolved_ips": ips, "blocked": blocked, "attempts": attempts}),
                    mimetype="application/json",
                    status_code=200
                )

        return func.HttpResponse(
            json.dumps({"ok": True, "host": host, "port": port, "open": False, "timeout_sec": timeout_sec, "resolved_ips": ips, "blocked": blocked, "attempts": attempts}),
            mimetype="application/json",
            status_code=200
        )
