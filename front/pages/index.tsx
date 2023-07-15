import type { NextPage } from 'next';
import { RequiredMark } from '../components/RequiredMark';
import { ChangeEvent, useState } from 'react';
import { axiosApi } from '../lib/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

type LoginForm = {
  email: string;
  password: string;
};

type Validation = {
  email?: string;
  password?: string;
  loginFailed?: string;
};

const Home: NextPage = () => {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [validation, setValidation] = useState<Validation>({
    email: '',
    password: '',
    loginFailed: '',
  });

  const updateLoginForm = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const login = () => {
    setValidation({});

    axiosApi.get('/sanctum/csrf-cookie').then((res: AxiosResponse) => {
      axiosApi
        .post('/login', loginForm)
        .then((response: AxiosResponse) => {
          console.log(response.data);
          router.push('/memos');
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 422) {
            // ここから追加
            const data = err.response?.data as any;
            const errors = data.errors;

            // state更新用のオブジェクトを別で定義
            const validationMessages: { [index: string]: string } =
              {} as Validation;
            Object.keys(errors).map((key: string) => {
              validationMessages[key] = errors[key][0];
            });
            // state更新用オブジェクトに更新
            setValidation(validationMessages); // ここまで追加
          }
          if (err.response?.status === 500) {
            alert('システムエラーです');
          }
        });
    });
  };

  return (
    <div className='w-2/3 mx-auto py-24'>
      <div className='w-1/2 mx-auto border-2 px-12 py-16 rounded-2xl'>
        <h3 className='mb-10 text-2xl text-center'>ログイン</h3>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>メールアドレス</p>
            <RequiredMark />
          </div>
          <input
            className='p-2 border rounded-md w-full outline-none'
            name='email'
            value={loginForm.email}
            onChange={updateLoginForm}
          />
          {validation.email && (
            <p className='py-3 text-red-500'>{validation.email}</p>
          )}
        </div>
        <div className='mb-5'>
          <div className='flex justify-start my-2'>
            <p>パスワード</p>
            <RequiredMark />
          </div>
          <small className='mb-2 text-gray-500 block'>
            8文字以上の半角英数字で入力してください
          </small>
          <input
            className='p-2 border rounded-md w-full outline-none'
            name='password'
            type='password'
            value={loginForm.password}
            onChange={updateLoginForm}
          />
          {validation.password && (
            <p className='py-3 text-red-500'>{validation.password}</p>
          )}
        </div>
        <div className='text-center mt-12'>
          {validation.loginFailed && (
            <p className='py-3 text-red-500'>{validation.loginFailed}</p>
          )}
          <button
            className='bg-gray-700 text-gray-50 py-3 sm:px-20 px-10 rounded-xl cursor-pointer drop-shadow-md hover:bg-gray-600'
            onClick={login}
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
