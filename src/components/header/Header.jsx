'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import logo from '../../../public/images/logo.png'
import { NivaranaSocialMedia } from '../social';


const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Dropdown trigger button */}
            <button
                onClick={handleToggle}
                className="flex text-gray-500 hover:text-black max-lg:border-b max-lg:py-3"
            >
                {title}
                {/* Arrow icon */}
                <svg
                    className={`w-4 h-4 ml-2 transition-transform transform ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            <div
                className={`sm:absolute mt-2 w-48 p-3 bg-white rounded-md shadow-lg ${isOpen ? "block" : "hidden"
                    }`}
            >
                <ul className="py-2">
                    {children.map((item => (
                        <li key={item.path} className='text-gray-500 hover:text-black border-b max-lg:py-3'>
                            <Link href={`/category/${item.path}`}>
                                {item.name}
                            </Link>
                        </li>)))}
                </ul>
            </div>
        </div>
    );
};

function MenuItem({ item }) {
    if (item.children && item.children.length > 0) return (
        <Dropdown title={item.name} children={item.children} />
    )
    return <li class="max-lg:border-b max-lg:py-3">
        <Link href={`/category/${item.path}`} class="text-gray-500 hover:text-black block">{item.name}</Link>
    </li>
}

function Header({ categories }) {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <header class='shadow-md bg-white font-sans tracking-wide relative z-50'>
            <section
                class='flex items-center lg:justify-center flex-wrap gap-5 relative py-3 px-10 border-gray-200 border-b lg:min-h-[80px] max-lg:min-h-[60px]'>
                <div className='mx-auto flex flex-col items-center'>
                    <Link href="/"><Image src={logo} alt="logo" class='md:w-[170px] w-36' /></Link>
                    <div className="hidden lg:block">India's Public Health Platform</div>
                </div>

                <div class="space-x-6 md:absolute md:right-10 flex items-center max-md:ml-auto">
                    <NivaranaSocialMedia/>
                </div>
            </section>

            <div class='flex flex-wrap py-3.5 px-4'>

                <div id="collapseMenu"
                    class={`w-full lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50 ${collapsed ? 'hidden' : 'block'}`}>
                    <button onClick={() => setCollapsed(true)} class='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-black" viewBox="0 0 320.591 320.591">
                            <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                data-original="#000000"></path>
                            <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                data-original="#000000"></path>
                        </svg>
                    </button>

                    <ul
                        class='lg:flex lg:justify-center lg:gap-x-10 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md z-50'>
                        <li class='mb-6 hidden max-lg:block'>
                            <Link href="/"><Image src={logo} alt="logo" class='w-36' />
                            </Link>
                        </li>
                        {categories.map((item) => <MenuItem item={item} key={item.path} />)}
                    </ul>
                </div>

                <div class='flex-auto flex lg:hidden'>
                    <div class="text-center flex-auto">India's Public Health Platform</div>
                    <button class="flex-initial" onClick={() => setCollapsed(false)}>
                        <svg class="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;
