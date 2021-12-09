describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test',
      username: 'test',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Test logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Blog post')
      cy.get('#author').type('Tester')
      cy.get('#url').type('example.com')
      cy.contains('add').click()

      cy.contains('Blog post Tester')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Blog post', author: 'Tester', url: 'example.com' })
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()

        cy.contains('1 likes')
      })


      it('The creator can remove a blog', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.contains('Blog post Tester').should('not.exist')
      })
    })

    it('Blog posts are correctly ordered', function(){
      cy.createBlog({ title: 'Blog 1', author: 'Tester', url: 'example.com' })
      cy.createBlog({ title: 'Blog 2', author: 'Tester', url: 'example.com' })

      cy.contains('Blog 1 Tester').contains('view').click()
      cy.contains('Blog 2 Tester').contains('view').click()
      cy.contains('Blog 1 Tester').contains('like').as('like1')
      cy.contains('Blog 2 Tester').contains('like').as('like2')

      cy.get('@like1').click()
      cy.get('@like1').parent().contains('1 likes')

      cy.get('.blog').then(elems => {
        const likes = [...elems].map(e => parseInt(e.innerText.match(/(\d) likes/)[1]))
        expect(likes).to.deep.equal([...likes].sort((a, b) => b - a))
      })

      cy.get('@like2').click()
      cy.get('@like2').parent().contains('1 likes')

      cy.get('@like2').click()
      cy.get('@like2').parent().contains('2 likes')

      cy.get('.blog').then(elems => {
        const likes = [...elems].map(e => parseInt(e.innerText.match(/(\d) likes/)[1]))
        expect(likes).to.deep.equal([...likes].sort((a, b) => b - a))
      })

    })
  })
})