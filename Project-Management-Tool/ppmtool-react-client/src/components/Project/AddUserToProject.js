import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getProject } from '../../actions/projectActions';

class AddUserToProject extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            role: 'MEMBER',
            errors: {},
            showModal: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        
        const { projectId } = this.props;
        const { userId, role } = this.state;
        
        const userData = {
            userId: parseInt(userId),
            role
        };

        axios
            .post(`/api/project/${projectId}/users`, userData)
            .then(res => {
                this.props.getProject(projectId);
                this.setState({
                    userId: '',
                    role: 'MEMBER',
                    showModal: false,
                    errors: {}
                });
            })
            .catch(err => {
                this.setState({
                    errors: err.response?.data || { error: 'Failed to add user to project' }
                });
            });
    }

    toggleModal() {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            errors: {}
        }));
    }

    render() {
        const { errors, showModal } = this.state;

        return (
            <div>
                <button 
                    className="btn btn-primary btn-sm" 
                    onClick={this.toggleModal}
                >
                    <i className="fas fa-user-plus mr-1"></i> Add User
                </button>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add User to Project</h5>
                                <button 
                                    type="button" 
                                    className="close" 
                                    onClick={this.toggleModal}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="userId">User ID</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                                            id="userId"
                                            name="userId"
                                            value={this.state.userId}
                                            onChange={this.onChange}
                                            placeholder="Enter user ID"
                                            required
                                        />
                                        {errors.userId && (
                                            <div className="invalid-feedback">
                                                {errors.userId}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="role">Role</label>
                                        <select
                                            className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                            id="role"
                                            name="role"
                                            value={this.state.role}
                                            onChange={this.onChange}
                                        >
                                            <option value="MEMBER">Member</option>
                                            <option value="LEADER">Leader</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                        {errors.role && (
                                            <div className="invalid-feedback">
                                                {errors.role}
                                            </div>
                                        )}
                                    </div>
                                    {errors.error && (
                                        <div className="alert alert-danger">
                                            {errors.error}
                                        </div>
                                    )}
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={this.toggleModal}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            Add User
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                    }

                    .modal-content {
                        background-color: white;
                        border-radius: 5px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        width: 500px;
                        max-width: 90%;
                    }

                    .modal-header {
                        padding: 15px 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .modal-title {
                        margin: 0;
                        font-size: 1.25rem;
                    }

                    .modal-body {
                        padding: 20px;
                    }

                    .modal-footer {
                        padding: 15px 20px;
                        border-top: 1px solid #eee;
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                    }

                    .close {
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 0;
                    }

                    .form-group {
                        margin-bottom: 1rem;
                    }

                    .form-control {
                        display: block;
                        width: 100%;
                        padding: 0.375rem 0.75rem;
                        font-size: 1rem;
                        line-height: 1.5;
                        color: #495057;
                        background-color: #fff;
                        border: 1px solid #ced4da;
                        border-radius: 0.25rem;
                        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                    }

                    .form-control:focus {
                        color: #495057;
                        background-color: #fff;
                        border-color: #80bdff;
                        outline: 0;
                        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                    }

                    .is-invalid {
                        border-color: #dc3545;
                    }

                    .invalid-feedback {
                        display: block;
                        width: 100%;
                        margin-top: 0.25rem;
                        font-size: 80%;
                        color: #dc3545;
                    }
                `}</style>
            </div>
        );
    }
}

AddUserToProject.propTypes = {
    projectId: PropTypes.string.isRequired,
    getProject: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps, { getProject })(AddUserToProject); 