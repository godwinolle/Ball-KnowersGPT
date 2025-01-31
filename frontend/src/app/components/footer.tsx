'use client'

const Footer = () => {
    let year: number = new Date().getFullYear()

    return(
        <footer className="w-full absolute bottom-0 text-center py-8">
            <p className="text-xs leading-7">
                <span className="mr-1">&copy; { year }</span> 
                <a href='https://www.godwincodes.com/' target="__blank">
                    godwin.codes
                </a>
            </p>
        </footer>
    )
}

export default Footer;