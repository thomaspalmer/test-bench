import React from 'react';

import ReactionApi from 'Services/Api/MainStage/Reaction';
import {Socket, User, Event} from 'Services';

import ReactionTriggers from './ReactionTriggers';

export default class Reactions extends React.Component {
    /**
     * @var state
     * @type {{emojis: [], reactionDisabled: boolean}}
     */
    state = {
        reactions: [],
        fullscreen: false
    };

    /**
     * @var containerRef
     * @type {null}
     */
    containerRef = null;

    /**
     * @var animateInterval
     * @type {null}
     */
    animateInterval = null;

    /**
     * @method componentDidMount
     */
    componentDidMount = () => {
        this.connectToBroadcasts();

        this.animateInterval = setInterval(this.animateReactions, 100);

        Event.on('fullscreen', (fullscreen) => {
            this.setState({
                fullscreen
            });
        });
    };

    /**
     * @method connectToBroadcasts
     */
    connectToBroadcasts = () => {
        Socket.getConnection()
            .private(`main_stage_reactions.${this.props.sessionId}`)
            .listen('MainStageReaction', (e) => {
                this.handleAddReaction(e.reaction);
            });
    };

    /**
     * @method animateReactions
     */
    animateReactions = () => {
        if (this.state.reactions.length === 0) {
            return;
        }

        let {reactions} = this.state;

        reactions = reactions.map((e) => {
            e.pos.left += e.step;
            let top = e.pos.top;

            if (e.fluctuation.direction === 'upper') {
                top += 1;

                if (top >= e.fluctuation.upper) {
                    e.fluctuation.direction = 'lower';
                }
            } else {
                top -= 1;

                if (top <= e.fluctuation.lower) {
                    e.fluctuation.direction = 'upper';
                }
            }
            e.pos.top = top;

            return e;
        });

        reactions = reactions.filter(e => e.pos.left < this.containerRef.clientWidth + 30);

        this.setState({
            reactions
        });
    };

    /**
     * @method handleAddReaction
     * @param {object} reaction
     */
    handleAddReaction = (reaction) => {
        const {reactions} = this.state;
        let top = Math.round(Math.random(0, 1) * 100);
        top = top < 5 ? 5 : (top > 90 ? 90 : top);
        const step = Math.round(Math.random(0, 1) * 5) + 5; // Between 5 and 10

        reactions.push({
            id: reaction.id,
            type: reaction.reaction,
            step,
            fluctuation: {
                upper: top + 5,
                lower: top - 5,
                direction: 'upper'
            },
            pos: {
                top,
                left: 0
            }
        });

        this.setState({
            reactions
        });
    };

    /**
     * @method renderReaction
     * @param {object} reaction
     * @return {JSX.Element}
     */
    renderReaction = (reaction) => {
        let top = reaction.pos.top * (this.containerRef.clientHeight / 100);

        if (top > (this.containerRef.clientHeight - 30)) {
            top = this.containerRef.clientHeight - 30;
        }

        return (
            <img
                key={reaction.id}
                src={`/images/reactions/${reaction.type}.png`}
                alt={reaction.type}
                className="absolute w-8 h-8 transition-all duration-200"
                style={{
                    ...reaction.pos,
                    top
                }}
            />
        );
    };

    /**
     * @method render
     * @return {JSX.Element}
     */
    render () {
        const {children, side} = this.props;
        const {reactions, fullscreen} = this.state;

        return (
            <div className="relative">
                {children}
                <div ref={ref => this.containerRef = ref} className="h-1/3 absolute left-0 right-0 bottom-0 pointer-events-none">
                    {reactions.map(this.renderReaction)}
                </div>

                <div className={
                    `absolute ${side}-0 top-0 h-full flex justify-center flex-col ${fullscreen ? `m${side[0]}-6` : `-m${side[0]}-6`}`
                }>
                    <ReactionTriggers
                        sessionId={this.props.sessionId}
                    />
                </div>
            </div>
        );
    };
}
