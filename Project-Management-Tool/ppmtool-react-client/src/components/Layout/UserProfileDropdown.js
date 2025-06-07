import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/securityActions';
import axios from 'axios';

class UserProfileDropdown extends Component {
  constructor() {
    super();
    this.state = {
      showDropdown: false,
      showDeleteConfirm: false,
      deleteError: null
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleDeleteConfirm = this.toggleDeleteConfirm.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdown);
  }

  closeDropdown(event) {
    if (this.dropdownRef && !this.dropdownRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  toggleDropdown() {
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown
    }));
  }

  toggleDeleteConfirm() {
    this.setState(prevState => ({
      showDeleteConfirm: !prevState.showDeleteConfirm,
      deleteError: null
    }));
  }

  async handleDeleteAccount() {
    try {
      const { user } = this.props.security;
      await axios.delete(`/api/users/${user.id}`);
      this.logout();
    } catch (error) {
      this.setState({
        deleteError: error.response?.data || 'Failed to delete account'
      });
    }
  }

  logout() {
    this.props.logout();
    window.location.href = "/login";
  }

  render() {
    const { user } = this.props.security;
    const { showDropdown, showDeleteConfirm, deleteError } = this.state;

    return (
      <div className="user-profile-dropdown" ref={node => this.dropdownRef = node}>
        <button 
          className="profile-toggle"
          onClick={this.toggleDropdown}
          aria-expanded={showDropdown}
        >
          <div className="user-avatar">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="user-name d-none d-md-block">{user.fullName}</span>
          <i className={`fas fa-chevron-down toggle-icon ${showDropdown ? 'open' : ''}`}></i>
        </button>
        
        {showDropdown && (
          <div className="dropdown-panel">
            <div className="dropdown-header">
              <div className="dropdown-user-avatar">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="dropdown-user-info">
                <div className="dropdown-user-name">{user.fullName}</div>
                <div className="dropdown-user-email">{user.username}</div>
              </div>
            </div>
            
            <div className="dropdown-menu-items">
              <Link className="dropdown-item" to="/profile">
                <div className="dropdown-item-icon">
                  <i className="fas fa-user-cog"></i>
                </div>
                <span>Profile Settings</span>
              </Link>

              <button className="dropdown-item text-danger" onClick={this.toggleDeleteConfirm}>
                <div className="dropdown-item-icon">
                  <i className="fas fa-trash-alt"></i>
                </div>
                <span>Delete Account</span>
              </button>
              
              <button className="dropdown-item" onClick={this.logout}>
                <div className="dropdown-item-icon logout-icon">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-confirm-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete Account</h5>
                <button className="close" onClick={this.toggleDeleteConfirm}>×</button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                {deleteError && (
                  <div className="alert alert-danger">{deleteError}</div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={this.toggleDeleteConfirm}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={this.handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .user-profile-dropdown {
            position: relative;
            z-index: 9999;
          }
          
          .profile-toggle {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 30px;
            padding: 5px 20px 5px 5px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .profile-toggle:hover, 
          .profile-toggle:focus {
            background: rgba(255, 255, 255, 0.3);
            outline: none;
          }
          
          .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 8px;
            transition: all 0.3s ease;
          }
          
          .profile-toggle:hover .user-avatar {
            transform: scale(1.05);
          }
          
          .user-name {
            margin-right: 8px;
            font-weight: 500;
          }
          
          .toggle-icon {
            font-size: 10px;
            transition: transform 0.3s ease;
          }
          
          .toggle-icon.open {
            transform: rotate(180deg);
          }
          
          .dropdown-panel {
            position: absolute;
            top: calc(100% + 12px);
            right: 0;
            width: 300px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            z-index: 9999;
            animation: dropdown-fade 0.2s ease;
            border: 1px solid rgba(0, 0, 0, 0.08);
          }
          
          @keyframes dropdown-fade {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .dropdown-header {
            display: flex;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: 1px solid #e9ecef;
          }
          
          .dropdown-user-avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 600;
            margin-right: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          }
          
          .dropdown-user-info {
            flex: 1;
          }
          
          .dropdown-user-name {
            font-weight: 600;
            color: #3a3b45;
            margin-bottom: 3px;
            font-size: 16px;
          }
          
          .dropdown-user-email {
            font-size: 13px;
            color: #858796;
          }
          
          .dropdown-menu-items {
            padding: 10px 0;
          }
          
          .dropdown-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #6e707e;
            text-decoration: none;
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
          }
          
          .dropdown-item:hover {
            background-color: #f8f9fc;
            color: #4e73df;
          }
          
          .dropdown-item-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background-color: rgba(78, 115, 223, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #4e73df;
            transition: all 0.2s ease;
            font-size: 15px;
          }
          
          .dropdown-item:hover .dropdown-item-icon {
            transform: rotate(10deg);
            background-color: rgba(78, 115, 223, 0.15);
          }
          
          .logout-icon {
            background-color: rgba(231, 74, 59, 0.1);
            color: #e74a3b;
          }
          
          .dropdown-item:hover .logout-icon {
            background-color: rgba(231, 74, 59, 0.15);
          }

          /* Fix for dropdown visibility across all browsers */
          @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            /* IE10+ specific styles */
            .dropdown-panel {
              z-index: 99999;
            }
          }
          
          @supports (-webkit-overflow-scrolling: touch) {
            /* iOS specific styles */
            .dropdown-panel {
              transform: translateZ(0);
            }
          }

          .delete-account {
            color: #e74a3b;
          }

          .delete-account:hover {
            background-color: #fdf3f2;
            color: #e74a3b;
          }

          .delete-icon {
            background-color: rgba(231, 74, 59, 0.1);
            color: #e74a3b;
          }

          .delete-confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          }

          .delete-confirm-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .delete-confirm-content h3 {
            color: #e74a3b;
            margin-bottom: 15px;
          }

          .delete-confirm-content p {
            color: #6e707e;
            margin-bottom: 25px;
            line-height: 1.5;
          }

          .delete-confirm-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }

          .cancel-button,
          .delete-button {
            padding: 8px 16px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .cancel-button {
            background-color: #f8f9fc;
            color: #6e707e;
          }

          .delete-button {
            background-color: #e74a3b;
            color: white;
          }

          .cancel-button:hover {
            background-color: #e9ecef;
          }

          .delete-button:hover {
            background-color: #d52a1a;
          }
        `}</style>
      </div>
    );
  }
}

UserProfileDropdown.propTypes = {
  logout: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(mapStateToProps, { logout })(UserProfileDropdown); 