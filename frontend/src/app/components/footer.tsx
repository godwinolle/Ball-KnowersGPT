'use client'

const Footer = () => {
    const year: number = new Date().getFullYear()

    return(
        <footer className="w-full relative text-center py-4 sm:py-6 shrink-0">
            <p className="text-xs leading-7">
                <span className="mr-1">&copy; { year }</span> 
                <a href='https://rodsyntax.com/' target="__blank">
                    rodsyntax.com
                </a>
            </p>
        </footer>
    )
}

export default Footer;