import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = [
        'Who won the latest Nobel Peace Prize?',
        'Generate 5 short Q & A flashcards for the programming language C',
        'Where does pizza come from?'
    ];

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    };

    const getResponse = async () => {
        if (!value) {
            setError('Error! Please ask a question!');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: chatHistory, message: value })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.text();
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { role: 'user', parts: [{ text: value }] },
                { role: 'model', parts: [{ text: data }] }
            ]);

            setValue('');
            setError('');
        } catch (error) {
            console.error(error);
            setError('Something went wrong!');
        }
    };

    const clear = () => {
        setValue('');
        setError('');
        setChatHistory([]);
    };

    return (
        <div className="app">
            <p className="title">
                Chat with Gemini API
                <button className="surprise" onClick={surprise}>
                    Surprise me
                </button>
            </p>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="When is Christmas...?"
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={!error ? getResponse : clear}>
                    {!error ? 'Ask me' : 'Clear'}
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="search-result">
                {chatHistory.map((chatItem, index) => (
                    <div key={index}>
                        <p className="answer">
                            <strong>{chatItem.role}:</strong> {chatItem.parts[0].text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
