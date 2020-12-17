import { useEffect } from 'react';
import { Router, Pages } from 'common/router';
import { Layout } from 'components';
import Login from 'pages/login';
import { combine } from 'stores';
import './App.css';
import './App.less';

const App = combine(({ stores }) => {
  const { showLogin, autoLogin } = stores.user;

  useEffect(() => {
    autoLogin();
  }, []);

  if (showLogin) return <Login />;

  return (
    <Router>
      <Layout>
        <Pages />
      </Layout>
    </Router>
  );
});

export default App;
