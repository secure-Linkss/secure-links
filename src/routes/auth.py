from flask import Blueprint, request, jsonify, session
<<<<<<< HEAD
from src.models.user import User, db
from src.models.audit_log import AuditLog
from datetime import datetime
import jwt
import os

auth_bp = Blueprint('auth', __name__)

def log_audit(user_id, action, details=None):
    """Helper to log audit events"""
    try:
        audit_log = AuditLog(
            actor_id=user_id,
            action=action,
            details=details,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        db.session.add(audit_log)
        db.session.commit()
    except Exception as e:
        print(f"Audit log error: {e}")

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user with PENDING status"""
    try:
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400

        user = User(
            username=username,
            email=email,
            role='member',
            status='pending',
            is_active=False,
            is_verified=False
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        log_audit(user.id, 'User registered', f'New user {username} registered with pending status')

        return jsonify({
            'message': 'Registration successful! Your account is pending admin approval.',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400

        user = User.query.filter_by(username=username).first()

        if not user or not user.check_password(password):
            if user:
                user.failed_login_attempts += 1
                db.session.commit()
            return jsonify({'error': 'Invalid credentials'}), 401

        if user.status == 'pending':
            return jsonify({'error': 'Your account is pending admin approval'}), 403

        if user.status == 'suspended':
            return jsonify({'error': 'Your account has been suspended'}), 403

        if user.status == 'expired':
            return jsonify({'error': 'Your subscription has expired'}), 403

        if not user.is_active:
            return jsonify({'error': 'Your account is inactive'}), 403

        user.last_login = datetime.utcnow()
        user.last_ip = request.remote_addr
        user.login_count += 1
        user.failed_login_attempts = 0
        db.session.commit()

        session['user_id'] = user.id
        session['role'] = user.role

        token = user.generate_token()

        log_audit(user.id, 'User logged in', f'User {username} logged in successfully')

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """User logout"""
    try:
        user_id = session.get('user_id')
        if user_id:
            log_audit(user_id, 'User logged out', 'User logged out successfully')

        session.clear()
        return jsonify({'message': 'Logout successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/me', methods=['GET'])
def get_current_user():
    """Get current user info"""
    try:
        user_id = session.get('user_id')

        if not user_id:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                user = User.verify_token(token)
                if not user:
                    return jsonify({'error': 'Invalid token'}), 401
                user_id = user.id
            else:
                return jsonify({'error': 'Not authenticated'}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': user.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    """Refresh JWT token"""
    try:
        user_id = session.get('user_id')

        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        token = user.generate_token()

        return jsonify({'token': token}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
=======
from src.models.user import db, User
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text):
    if not text:
        return ''
    return text.strip()

@auth_bp.route('/auth', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        # Check if user is logged in
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                return jsonify({
                    'authenticated': True,
                    'user': user.to_dict()
                })
        
        return jsonify({'authenticated': False})
    
    elif request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        action = data.get('action', '')
        
        if action == 'login':
            username = sanitize_input(data.get('username', ''))
            password = data.get('password', '')
            
            if not username or not password:
                return jsonify({'success': False, 'error': 'Username and password are required'}), 400
            
            # Find user by username or email
            user = User.query.filter(
                (User.username == username) | (User.email == username)
            ).first()
            
            if user and user.check_password(password):
                session['user_id'] = user.id
                return jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'user': user.to_dict()
                })
            else:
                return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
        
        elif action == 'register':
            username = sanitize_input(data.get('username', ''))
            email = sanitize_input(data.get('email', ''))
            password = data.get('password', '')
            confirm_password = data.get('confirm_password', '')

            if not username and not email:
                return jsonify({'success': False, 'error': 'Username or email is required'}), 400
            
            if not password:
                return jsonify({'success': False, 'error': 'Password is required'}), 400

            if password != confirm_password:
                return jsonify({'success': False, 'error': 'Passwords do not match'}), 400

            if len(password) < 6:
                return jsonify({'success': False, 'error': 'Password must be at least 6 characters long'}), 400

            # If only username is provided, and it's not an email format, use a placeholder email
            if username and not email:
                if not validate_email(username):
                    email = f"{username}@placeholder.com" # Use a placeholder email
                else:
                    email = username # If username is an email, use it as email
            
            # If only email is provided, use a derived username
            if email and not username:
                username = email.split('@')[0] # Simple username from email prefix

            if not validate_email(email):
                return jsonify({'success': False, 'error': 'Invalid email format'}), 400
            
            # Check if user already exists
            existing_user = User.query.filter(
                (User.username == username) | (User.email == email)
            ).first()
            
            if existing_user:
                return jsonify({'success': False, 'error': 'Username or email already exists'}), 409
            
            # Create new user
            try:
                user = User(username=username, email=email)
                user.set_password(password)
                db.session.add(user)
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'User created successfully',
                    'user_id': user.id
                })
            except Exception as e:
                db.session.rollback()
                return jsonify({'success': False, 'error': f'Failed to create user: {str(e)}'}), 500
        
        elif action == 'logout':
            session.pop('user_id', None)
            return jsonify({
                'success': True,
                'message': 'Logout successful'
            })
        
        else:
            return jsonify({'success': False, 'error': 'Invalid action'}), 400


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login request data: {data}")  # Debug logging
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    username = sanitize_input(data.get('username', ''))
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password are required'}), 400
    
    # Find user by username or email
    user = User.query.filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        })
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    username = sanitize_input(data.get('username', ''))
    email = sanitize_input(data.get('email', ''))
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not username and not email:
        return jsonify({'success': False, 'error': 'Username or email is required'}), 400
    
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'}), 400

    if password != confirm_password:
        return jsonify({'success': False, 'error': 'Passwords do not match'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'error': 'Password must be at least 6 characters long'}), 400

    # If only username is provided, and it's not an email format, use a placeholder email
    if username and not email:
        if not validate_email(username):
            email = f"{username}@placeholder.com" # Use a placeholder email
        else:
            email = username # If username is an email, use it as email
    
    # If only email is provided, use a derived username
    if email and not username:
        username = email.split('@')[0] # Simple username from email prefix

    if not validate_email(email):
        return jsonify({'success': False, 'error': 'Invalid email format'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        return jsonify({'success': False, 'error': 'Username or email already exists'}), 409
    
    # Create new user
    try:
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user_id': user.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': f'Failed to create user: {str(e)}'}), 500

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({
        'success': True,
        'message': 'Logout successful'
    })

>>>>>>> 00392b0 (Initial commit of unified Brain Link Tracker project with integrated admin panel fixes)
