import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()

  // =========================
  // SIGNUP VALIDATION
  // =========================

  const signupSchema = z
    .object({
      firstName: z
        .string()
        .min(1, 'First name is required'),

      lastName: z
        .string()
        .min(1, 'Last name is required'),

      email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),

      password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),

      confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),

      yearOfBirth: z.string(),

      gender: z.string(),
    })
    .refine(
      (data) =>
        data.password === data.confirmPassword,
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }
    )

  // =========================
  // SIGNUP MUTATION
  // =========================

  const signupMutation = useMutation({

    mutationFn: async (formData) => {

      const response = await fetch(
        'http://localhost:8080/auth/signup',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,

            yearOfBirth: formData.yearOfBirth
              ? Number(formData.yearOfBirth)
              : null,

            gender: formData.gender || null,
          }),
        }
      )

      if (!response.ok) {

        const errorText =
          await response.text()

        throw new Error(
          errorText || 'Signup failed'
        )
      }

      // Backend şu anda String döndürüyor.
      // Bu yüzden response.json() kullanmıyoruz.

      return response.text()
    },
  })


  // =========================
  // FORM
  // =========================

  const form = useForm({

    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      yearOfBirth: '',
      gender: '',
    },

    onSubmit: async ({ value }) => {

      const result =
        signupSchema.safeParse(value)

      if (!result.success) {
        return
      }

      signupMutation.mutate(value)
    },
  })


  return (
    <div>

      {/* ================= NAVIGATION ================= */}

      <nav className="public-nav">

        <button
          onClick={() => navigate('/public')}
        >
          Public
        </button>

        <button
          onClick={() => navigate('/login')}
        >
          Login
        </button>

        <button
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>

      </nav>


      {/* ================= SIGNUP ================= */}

      <div className="signup-container">

        <div className="signup-card">

          <h1>
            Sign Up
          </h1>


          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()

              form.handleSubmit()
            }}
          >

            {/* ================= FIRST NAME ================= */}

            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'First name is required'
                    : undefined,
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    First Name
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= LAST NAME ================= */}

            <form.Field
              name="lastName"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'Last name is required'
                    : undefined,
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Last Name
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= EMAIL ================= */}

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {

                  if (!value) {
                    return 'Email is required'
                  }

                  if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ) {
                    return 'Please enter a valid email'
                  }

                  return undefined
                },
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Email
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= PASSWORD ================= */}

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {

                  if (!value) {
                    return 'Password is required'
                  }

                  if (value.length < 6) {
                    return 'Password must be at least 6 characters'
                  }

                  return undefined
                },
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Password
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= CONFIRM PASSWORD ================= */}

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => {

                  if (!value) {
                    return 'Please confirm your password'
                  }

                  const password =
                    form.getFieldValue('password')

                  if (value !== password) {
                    return 'Passwords do not match'
                  }

                  return undefined
                },
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Confirm Password
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= YEAR OF BIRTH ================= */}

            <form.Field
              name="yearOfBirth"
              validators={{
                onChange: ({ value }) => {

                  if (
                    value &&
                    !/^\d*$/.test(value)
                  ) {
                    return 'Year of Birth must contain only numbers'
                  }

                  if (
                    value &&
                    value.length > 4
                  ) {
                    return 'Year of Birth must be 4 digits'
                  }

                  return undefined
                },
              }}
            >

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Year of Birth
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="numeric"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {

                      const value =
                        e.target.value

                      if (
                        /^\d*$/.test(value) &&
                        value.length <= 4
                      ) {
                        field.handleChange(value)
                      }

                    }}
                  />

                  {field.state.meta.errors.length > 0 && (
                    <div className="field-error">
                      {field.state.meta.errors.join(', ')}
                    </div>
                  )}
                </>
              )}

            </form.Field>


            {/* ================= GENDER ================= */}

            <form.Field name="gender">

              {(field) => (
                <>
                  <label htmlFor={field.name}>
                    Gender
                  </label>

                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="FEMALE">
                      Female
                    </option>

                    <option value="MALE">
                      Male
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>
                </>
              )}

            </form.Field>


            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending
                ? 'Signing Up...'
                : 'Sign Up'}
            </button>

          </form>


          {/* ================= SUCCESS ================= */}

          {signupMutation.isSuccess && (

            <div className="success-message">

              <h3>
                Sign Up Successful! 🎉
              </h3>

              <p>
                Your account has been created successfully.
              </p>

              <p>
                Please check your email to verify your account.
              </p>

            </div>

          )}


          {/* ================= ERROR ================= */}

          {signupMutation.isError && (

            <div className="error-message">
              {signupMutation.error.message}
            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default Signup