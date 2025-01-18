import React, { createRef } from "react";
import { ReactNode } from "react";
import jwt from 'jsonwebtoken';

import countries from '../assets/CountryCodes.json'
import { Listbox } from "@headlessui/react";
import { ComicToken } from "../Utils/Token";


interface IRegisterProps {
    onRegister: () => void;
}

interface IRegisterState {
    phoneNumber?: string;
    selectedCountry?: Country
    error: string | null;
}

interface Country {
    name: string;
    dial_code: string;
    code: string;
}

export class Register extends React.Component<IRegisterProps, IRegisterState> {
    codeInput = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);

        this.state = {
            error: null
        }
    }


    async componentDidMount(): Promise<void> {
        try {
            // Try to get user's country from IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // Find matching country in our list
            const userCountry = countries.find(
                country => country.code === data.country
            );

            if (userCountry) {
                this.setCountry(userCountry);
            }
        } catch (error) {
            console.error('Failed to detect country:', error);
            // Fallback to default country (e.g., France)
            const defaultCountry = countries.find(
                country => country.code === 'FR'
            );
            if (defaultCountry) {
                this.setCountry(defaultCountry);
            }
        }
    }

    setCountry(country: Country) {
        if (this.codeInput.current) {
            this.codeInput.current.value = country.dial_code.substring(1);
        }

        this.setState({ selectedCountry: country })
    }

    generateToken = async () => {
        if (this.state.phoneNumber && this.state.selectedCountry) {
            try {
                this.setState({ error: null });
                await ComicToken.register(
                    `${this.state.selectedCountry.dial_code}${this.state.phoneNumber.replace(/\D/g, '').replace(/^0/, '')}`
                );
                this.props.onRegister();
            } catch (error) {
                this.setState({
                    error: error instanceof Error ? error.message : 'Failed to generate token'
                });
            }
        }
    }

    render() {
        return (
            <div className="inset-0 fixed flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h1 className="text-2xl font-bold mb-4 text-center">Verify your phone number</h1>
                    <p className="text-gray-600 mb-6 text-center">
                        ComicChat will send an SMS message to verify your phone number. Enter your country code and phone number:
                    </p>
    
                    {this.state.error && (
                        <div className="text-red-500 mb-4 text-center">
                            {this.state.error}
                        </div>
                    )}
    
                    <div className="space-y-4">
                        <Listbox defaultValue={this.state.selectedCountry} onChange={(c) => this.setCountry(c)}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-comic focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                                    <span className="block truncate">
                                        {this.state.selectedCountry ? this.state.selectedCountry.name : 'Select country'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                    {countries.map((country) => (
                                        <Listbox.Option
                                            key={country.code}
                                            value={country}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-indigo-100 text-comic' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {country.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-comic">
                                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
    
                        <div className="flex gap-2">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+</div>
                                <input 
                                    ref={this.codeInput}
                                    className="w-16 pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic"
                                />
                            </div>
    
                            <input 
                                type="tel"
                                placeholder="Phone number"
                                onChange={(e) => this.setState({ phoneNumber: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic"
                            />
                        </div>
    
                        <button 
                            onClick={this.generateToken}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            Valider mon numéro
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}