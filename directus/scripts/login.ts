import { Directus } from '@directus/sdk'

const login = async (directus = null) => {
  if (!directus) {
    directus = new Directus('http://localhost:8055/', {
      auth: {
        mode: 'cookie',
      },
    })
  }
  await directus.auth
    .login({
      email: 'dev@payloadcms.com',
      password: 'test',
    })
    .catch(() => {
      console.error('Invalid credentials')
    })

  const token = await directus.auth.token
  console.log({ token })

  return token
}

export default login
