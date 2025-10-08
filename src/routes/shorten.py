from flask import Blueprint, request, jsonify, session
<<<<<<< HEAD
from src.models.link import Link
from src.models.user import User, db
from functools import wraps

shorten_bp = Blueprint('shorten', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@shorten_bp.route('/shorten', methods=['POST'])
@login_required
def shorten_url():
    """Shorten URL (alias for creating link)"""
    try:
        user_id = session.get('user_id')
        user = User.query.get(user_id)

        if not user.can_create_link():
            return jsonify({'error': 'Daily link limit reached'}), 403

        data = request.get_json()
        url = data.get('url')

        if not url:
            return jsonify({'error': 'URL required'}), 400

        link = Link(
            user_id=user_id,
            target_url=url,
            campaign_name=data.get('campaign_name', 'Quick Link')
        )

        db.session.add(link)
        user.increment_link_usage()
        db.session.commit()

        return jsonify({
            'short_url': f"{request.host_url.rstrip('/')}/t/{link.short_code}",
            'short_code': link.short_code
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
=======
from src.models.user import db, User
from src.models.link import Link
import string
import random
import requests
import os

shorten_bp = Blueprint("shorten", __name__)

def generate_short_code(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

@shorten_bp.route("/shorten", methods=["POST"])
def shorten_url():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get("originalUrl"):
            return jsonify({"error": "Original URL is required"}), 400
        
        original_url = data.get("originalUrl").strip()
        
        # Generate a short code
        short_code = generate_short_code()
        
        # Check if short code already exists
        while Link.query.filter_by(short_code=short_code).first():
            short_code = generate_short_code()
        
        # Try to use Short.io API if available
        shortio_api_key = os.environ.get('SHORTIO_API_KEY')
        shortio_domain = os.environ.get('SHORTIO_DOMAIN')
        
        if shortio_api_key and shortio_domain:
            try:
                shortio_response = requests.post(
                    'https://api.short.io/links',
                    headers={
                        'Authorization': shortio_api_key,
                        'Content-Type': 'application/json'
                    },
                    json={
                        'originalURL': original_url,
                        'domain': shortio_domain,
                        'path': short_code
                    },
                    timeout=10
                )
                
                if shortio_response.status_code == 200:
                    shortio_data = shortio_response.json()
                    shortened_url = shortio_data.get('shortURL', f"https://{shortio_domain}/{short_code}")
                else:
                    # Fallback to local shortening
                    shortened_url = f"{request.host_url}t/{short_code}"
                    
            except Exception as e:
                print(f"Short.io API error: {e}")
                # Fallback to local shortening
                shortened_url = f"{request.host_url}t/{short_code}"
        else:
            # Local shortening
            shortened_url = f"{request.host_url}t/{short_code}"
        
        # Create link record in database
        link = Link(
            target_url=original_url,
            short_code=short_code,
            campaign_name="Quick Shorten",
            user_id=1,  # Default user for anonymous shortening
            status='active'
        )
        
        db.session.add(link)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "shortenedUrl": shortened_url,
            "shortCode": short_code
        })
        
    except Exception as e:
        print(f"Error shortening URL: {e}")
        return jsonify({"error": "Failed to shorten URL"}), 500

>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
