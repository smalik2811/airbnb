exports.error404 = (req, res) => {
    res.status(404).render(
        '404', {
            pageTitle: 'Page not Found',
            activePage: "",
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        }
    )
}