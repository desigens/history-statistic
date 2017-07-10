import React, {Component} from 'react';

class Visit extends Component {
    render() {
        return (
            <li>
                {new Date(this.props.item.visitTime) + ''}
                <br />
                <span>
                    <a href={this.props.item.url} target="_blank">
                        {this.props.item.url}
                    </a>
                </span>
            </li>
        );
    }
}

export default class History extends Component {
    render() {
        const {hosts} = this.props;
        return (
            <ul>
                {Object.keys(hosts).map((host, index) => {
                    return (
                        <li key={index}>
                            {host}
                            <ul>
                                {Object.keys(hosts[host]).map((period, index) =>
                                    <li key={index}>
                                        {period}
                                        <ul>
                                            {hosts[host][
                                                period
                                            ].map((visitItem, index) =>
                                                <Visit
                                                    key={index}
                                                    item={visitItem}
                                                />
                                            )}
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        );
    }
}
