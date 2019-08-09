import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu } from 'antd';

function Header() {
    const [selectKey, setSelectKey] = useState('1');
    const [count, setCount] = useState('1');

    const aaa = useEffect(() => {
        document.title = `You clicked ${selectKey} times`;
        return () => {
            document.title = `You clicked ${1235551} times`;
        };
    }, [selectKey]);
    return (
        <Layout>
            <Layout.Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[selectKey]}
                    style={{ lineHeight: '64px' }}
                    onClick={(e) => {
                        setSelectKey(e.key);
                    }}
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                    <Menu.Item key="4">nav 4</Menu.Item>

                    <Menu.Item key="5">nav 5</Menu.Item>
                </Menu>
            </Layout.Header>
        </Layout>
    );
}

export default Header;
