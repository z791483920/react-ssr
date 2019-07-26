import React from 'react';
import './index.css';

class Home extends React.Component {
  state = {
      aaa: ''
  };

  render() {
      return (
          <div className="home" style={{ color: 'green', fontSize: '31px' }}>
              <div>This is sanyuan</div>
              <button
                  type="button"
                  onClick={() => {
                      alert('13');
                  }}
              >
          click
              </button>
              <div>dgfasd</div>
              <a
                  onClick={() => {
                      this.props.history.push('/login');
                  }}
              >
          去login
              </a>
          </div>
      );
  }
}

export default Home;
