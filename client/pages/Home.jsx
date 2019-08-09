import React from 'react';
import Header from '../components/Header';
import './index.css';
import { Provider, Consumer } from '../components/Test';
import Context from '../components/Context';
import TestReducer from '../components/TestReducer';
import { Button } from 'antd';

class Home extends React.Component {
  state = {
      userInfo: {
          name: 'lxfriday',
          age: 24
      },
      school: 'hzzz'
  };

  listRef = React.createRef();

  aaa = 13123;

  static fetch = () => '1111';
  // static getDerivedStateFromProps(nextProps, prevState) {
  //     console.log(nextProps, 'nextProps');
  //     console.log(prevState, 'prevState');
  //     return null;
  // }

  getSnapshotBeforeUpdate(prevProps, prevState) {
      console.log('getSnapshotBeforeUpdate');
      return this.aaa;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      console.log(snapshot, ';1213snap');
  }

  static getDerivedStateFromError(error) {
      return { hasError: true };
  }

  handleChangeUserInfo = () => {
      const { userInfo } = this.state;
      userInfo.sex = 'male';
      this.setState({ userInfo });
  };

  handleChangeSchool = () => {
      this.setState({ school: 'zzzh' });
  };

  render() {
      const { userInfo, school, hasError } = this.state;
      return (
          <div ref={this.listRef}>
              <Header />
              {/* <div>
                  <button onClick={this.handleChangeUserInfo}>change userInfo</button>
                  <button onClick={this.handleChangeSchool}>change school</button>
                  <button
                      onClick={() => {
                          this.aaa += 1;
                      }}
                  >
            change aaa
                  </button>

                  <br />
                  {JSON.stringify(userInfo)}
                  <br />
              </div> */}
              <TestReducer />
              <div>
                  <Button
                      onClick={() => {
                          this.props.history.push('/login');
                      }}
                  >
            去login
                  </Button>
              </div>
          </div>
      );
  }
}

export default Home;
