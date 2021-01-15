module.exports = {
  signUpMail: {
    subject: 'ws-express sign-up',
    content: (name, email, password) =>
      `
    <div style="margin: 0em 0em 8em 4em;">
    <h1>Sign up successful</h1>
    <p>Welcome ${name}</p>
    <ul>
    <li><strong>Name</strong>: ${name}</li>
    <li><strong>Email</strong>:${email}</li>
    <li><strong>Password</strong>:${password}</li>
    </ul>
    </div>
    `
  },
  congratulationsMail: {
    subject: 'ws-express congratulations',
    content: name =>
      `
    <div style="margin: 0em 0em 8em 4em;">
    <h1>Congratulations ${name}</h1>
    <h2>You had the best weets today!! Keep it up :)</h2>
    </div>
    `
  }
};
