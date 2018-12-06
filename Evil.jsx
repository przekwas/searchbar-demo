import React, { Component } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Jumbotron from '../components/Jumbotron.jsx';
import PartsCard from '../components/Cards/PartsCard';
import * as prostheticsServices from '../services/prosthetics';
import * as categoryServices from '../services/categories';
import Autosuggest from 'react-autosuggest';
import './SlayinIt.css';

let categories;

categoryServices.all()
    .then(data => categories = data);

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : categories.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <span id={suggestion.id}>
        {suggestion.name}
    </span>
);

class Slayin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayProsthetics: [],
            suggestions: [],
            value: ''
        };
    }

    async componentDidMount() {
        try {
            let displayProsthetics = await prostheticsServices.all();
            this.setState({ displayProsthetics });
        } catch (e) {
            console.log(e);
        }
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {

        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'What type of prosthetic are you looking for?',
            value,
            onChange: this.onChange,
        };

        return (
            <>
                <Navbar />
                <Jumbotron title="Full Selection" subtitle="See What's Available" />
                <div className="m-5">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                </div>
                <div className="container">
                    <div className="row">
                        {this.state.displayProsthetics.map(item => {
                            return(
                                    <PartsCard key={item.id} parts={item} />
                            );
                        })}
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}
export default Slayin;