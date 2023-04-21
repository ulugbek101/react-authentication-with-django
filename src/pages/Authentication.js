import {json, redirect} from "react-router-dom";

import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({request}) {
  const searchParams = new URL(request.url).searchParams;
  let mode = searchParams.get('mode') || 'login';
  const data = await request.formData();

  const authData = {
    username: data.get('email'),
    password: data.get('password'),
  }

  if (mode !== 'login' && mode !== 'signup') {
    // mode = 'login'
    throw json({message: 'Not Found !'}, {status: 404});
  }

  const response = fetch('http://localhost:8000/api/v1/' + mode + '/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData)
  })
  
  if ((await response).status === 422 || (await response).status === 401) {
    return response;
  }

  if (!(await response).ok) {
    return json({message: 'Could not authenticate/authorize user.'}, {status: 500});
  }

  // manage auth token attaching to local storage or somewhere else

  return redirect('/');
};
