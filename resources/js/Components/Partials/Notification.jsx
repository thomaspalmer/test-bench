import React from 'react';
import TimeAgo from 'react-timeago';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt} from '@fortawesome/free-solid-svg-icons';

import Notifications from 'Services/Api/Me/Notifications';
import {User} from 'Services';

class Notification extends React.Component {
    /**
     * @method handleGoToNotification
     * @return {Promise<void>}
     */
    handleGoToNotification = async () => {
        const {notification} = this.props;
        let request = null;

        // Mark as read
        if (notification.read_at === null) {
            request = await Notifications.patch(null,{
                ids: [notification.id]
            });

            if (request.success) {
                // Update local
                this.props.onRead(notification.id);
            }
        }

        if (notification.read_at !== null || request.success) {
            if (notification.action_url) {
                // Check Team
                if (User.data.active_team_id !== notification.team_id) {
                    await this.props.onSwitchToTeam(notification.team, true);
                }

                // Go to notification
                this.props.history.push(notification.action_url);
            }
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render() {
        const {notification} = this.props;

        return (
            <div
                className="cursor-pointer p-2 flex items-center rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
                onClick={this.handleGoToNotification}
            >
                <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-indigo-600">
                    {this.renderIcon()}
                </div>

                <div className="ml-4 flex-grow">
                    <p className={`text-base font-medium text-${notification.read_at === null ? 'light-blue-700' : 'gray-900'}`}>
                        {notification.data.title}
                    </p>
                    {notification.data.message && (
                        <p className="mt-1 text-sm text-gray-700">
                            {notification.data.message}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        <TimeAgo date={notification.created_at} />
                        {window.base.features.teams && (<span> &middot; {notification.team.name}</span>)}
                    </p>
                </div>

                {notification.read_at === null && (
                    <div className="flex-shrink-0 w-4 h-4 flex bg-light-blue-700 rounded-full"></div>
                )}
            </div>
        );
    }

    /**
     * @method renderIcon
     * @return {JSX.Element}
     */
    renderIcon = () => {
        const {action_type = null} = this.props.notification.data;

        switch (action_type) {
            default:
                return <FontAwesomeIcon icon={faPencilAlt} size="lg" />;
        }
    };
}

export default withRouter(Notification);
