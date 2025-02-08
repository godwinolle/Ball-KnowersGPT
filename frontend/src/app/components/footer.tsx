'use client'

const Footer = () => {
    const year: number = new Date().getFullYear()

    return(
        <footer className="w-full relative text-center py-8">
            <p className="text-xs leading-7">
                <span className="mr-1">&copy; { year }</span> 
                <a href='https://godwin.codes/' target="__blank">
                    godwin.codes
                </a>
            </p>
        </footer>
    )
}

export default Footer;