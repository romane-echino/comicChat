import React, { createRef } from "react";
import { ReactNode } from "react";

import countries from '../assets/CountryCodes.json'
import { Listbox } from "@headlessui/react";


interface IRegisterProps {
}

interface IRegisterState {

    selectedCountry?: Country
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

        }
    }


    componentDidMount(): void {
    }

    setCountry(country: Country) {
        if (this.codeInput.current) {
            this.codeInput.current.value = country.dial_code.substring(1);
        }

        this.setState({ selectedCountry: country })
    }

    render() {
        return (
            <div className="inset-0 fixed">
                <div>
                    <h1>Verify your phone number</h1>
                    <p>ComicChat will send an SMS message to verify your phone number. Enter your country code and phone number :</p>

                    <Listbox value={this.state.selectedCountry} onChange={(c) => this.setCountry(c)}>
                        <Listbox.Button>{this.state.selectedCountry ? this.state.selectedCountry.name : 'select country'}</Listbox.Button>
                        <Listbox.Options>
                            {countries.map((person) => (
                                <Listbox.Option
                                    key={person.code}
                                    value={person}
                                >
                                    {person.name}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Listbox>

                    <div className="flex gap-4">
                        <div className="relative">
                            <div className="absolute">+</div>
                            <input ref={this.codeInput} />

                        </div>

                        <input type="phone" placeholder="phone number" />
                    </div>
                </div>
            </div>
        )
    }
}