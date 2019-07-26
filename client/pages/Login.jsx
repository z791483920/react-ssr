import React from 'react';
import _ from 'lodash';
import './Login.css';

class Login extends React.Component {
    render() {
        return (
            <div className="login">
                <div>登陆页面</div>
                <button
                    type="button"
                    onClick={() => {
                        alert('23123123');
                    }}
                >
          click
                </button>

                <a
                    onClick={() => {
                        const aa = _.cloneDeep({ a: 1 });
                        this.props.history.push('/');
                    }}
                >
          去home
                </a>
            </div>
        );
    }
}

export default Login;
