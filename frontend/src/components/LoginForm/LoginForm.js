import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
import InputField from '../common/InputField';
import Button from '../common/Button';
import '../common/Form.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const updateCredential = (e) => setCredential(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInput = { credential, password };
    const response = await dispatch(login(userInput));

    if (response && response.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        id="login-credential"
        placeholder="Your email address or username"
        value={credential}
        onChange={updateCredential}
        error={errors.credential}
      />
      <InputField
        id="login-password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={updatePassword}
        error={errors.password}
      />
      <Button
        label="Sign In"
        className="large-button form-button"
        type="submit"
      />
    </form>
  );
};

export default LoginForm;
