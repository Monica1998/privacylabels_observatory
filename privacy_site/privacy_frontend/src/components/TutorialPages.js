import React, { Component } from 'react'
import TableImage from './table.jpg'
import GraphImage from './graph.png'

export const PrivacyPage = () => {
    return (
        <div className="text-center py-1 mx-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-gray-900 dark:text-white">
          What are Privacy Nutrition Labels?
        </h1>
        <p className="text-2xl text-justify mb-6 mt-3">
          Privacy nutrition labels are standardized markers that offer clear information about how an app collects, uses, and shares personal data. These labels provide a simplified summary of privacy practices without the complexity of privacy policies.
        </p>
        <p className="text-2xl text-justify mb-6">
          Different types of Privacy tags include:
        </p>
        <ul className="list-[upper-roman] list-inside text-2xl">
          <li>Data Linked to You</li>
          <li>Data Not Linked to You</li>
          <li>Data Not Collected</li>
          <li>Data Used to Track You</li>
        </ul>
        <p className="text-2xl text-justify mt-6">
          For more information about privacy labels and their purpose, please visit
          <a href="https://developer.apple.com/app-store/app-privacy-details/" target="_blank" className="underline ml-1">
            Apple
          </a>{' '}
          for additional details on Privacy labels.
        </p>
      </div>
      
    )
    }

export const TablePage = () => {
    return(
        <div className="m-4 space-y-4 removeMarginBottom text-center">
        <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-gray-900 dark:text-white">
            Explore Our Vast Collection of Apps!
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center">
            <p className="text-xl md:text-2xl text-left md:mt-0 md:w-1/2">
            Dive into our extensive catalog of millions of applications housed within the "Browse Apps" section. Ready for a browsing spree? Explore our array of fascinating applications!
            </p>
            <div className="md:w-1/2">
            <img src={TableImage} alt="Table Not Loading" className="w-full h-auto md:h-96 border-2 border-black p-2 m-2 border-solid"/>
            </div>
        </div>
        <p className="text-xl md:text-2xl text-left mt-4">
            Excited about an app? Simply click on its name to unveil comprehensive details and a deeper insight into its details.
        </p>
        </div>
    )
}

export const GraphPage = () => {
    return(
    <div className="m-4 py-2 removeMarginBottom text-center">
    <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-gray-900 dark:text-white">
        Discover Our Dynamic Graphs!
    </h1>
    <div className='flex flex-col md:flex-row items-center justify-center'>
        <div className='md:w-1/2'>
        <p className="text-xl md:text-2xl text-left">
            Explore multiple dynamic graphs, each revealing unique insights about our research data. Want a different perspective? A simple click swaps out the graph and its associated data effortlessly!
        </p>
        <p className="text-xl md:text-2xl text-left mt-4">
            Dive into the interactivity! Hover over the graphs to uncover specific details and delve deeper into the story they tell.
        </p>
        </div>
        <div className='md:w-1/2'>
        <img src={GraphImage} alt='Graph Not Loading' className="h-auto md:h-96 w-full border-2 border-black p-2 m-2 border-solid"/>
        </div>
    </div>
    </div>
    )
}

export const SearchPage = () => {
    return(
        <div className="m-4 py-6 removeMarginBottom text-center">
        <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-gray-900 dark:text-white">
            How to Explore & Discover?
        </h1>
        <p className="text-2xl text-justify mt-4">
            Dive into our search functionalities! There are two exciting ways to find your perfect app:
        </p>
        <div className="text-left">
            <p className="text-2xl text-justify mt-4">
            Autofill Search: Glide through over 500,000 preloaded apps. It's instant, seamless, and fun! Select from thousands of top-rated apps right from the app store – all at your fingertips.
            </p>
            <p className="text-2xl text-justify mt-4">
            Deep Search: If your desired app isn't listed, don't worry! Simply enter your search terms and presto! In a jiffy, we'll pull up all related searches. Choose the perfect app that matches your needs.
            </p>
        </div>
        </div>

    )
}
