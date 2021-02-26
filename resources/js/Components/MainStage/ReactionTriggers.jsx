import React from 'react';
import ReactionApi from 'Services/Api/MainStage/Reaction';

export default class ReactionTriggers extends React.Component {
    /**
     * @var reactionTimeout
     * @type {number}
     */
    reactionTimeout = 5000;

    /**
     * @var reactions
     * @type {[{name: string, title: string}, {name: string, title: string}, {name: string, title: string}, {name: string, title: string}]}
     */
    reactions = [
        {name: 'love', title: 'Love this'},
        {name: 'like', title: 'like this'},
        {name: 'shocked', title: 'Shocked by this'},
        {name: 'applaud', title: 'Applaud this'}
    ];

    /**
     * @var state
     * @type {{reactionDisabled: boolean}}
     */
    state = {
        reactionDisabled: false
    };

    /**
     * @method handleReaction
     * @param {string} reaction
     * @return {Promise<void>}
     */
    handleReaction = async (reaction) => {
        if (this.state.reactionDisabled) {
            return;
        }

        const request = await ReactionApi.post({
            session: this.props.sessionId
        }, {
            reaction,
        }, 'react');

        if (request.success) {
            this.setState({
                reactionDisabled: true
            });

            setTimeout(() => {
                this.setState({
                    reactionDisabled: false
                });
            }, this.reactionTimeout);
        }
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        return (
            <React.Fragment>
                {this.reactions.map(reaction => (
                    <div
                        onClick={() => this.handleReaction(reaction.name)}
                        key={reaction.title}
                        title={reaction.title}
                        className={`my-1 cursor-pointer ${this.state.reactionDisabled ? 'opacity-50' : ''}`}
                    >
                        <img
                            src={`/images/reactions/${reaction.name}.png`}
                            alt={reaction.title}
                            className="w-12 h-12"
                        />
                    </div>
                ))}
            </React.Fragment>
        );
    }
}
