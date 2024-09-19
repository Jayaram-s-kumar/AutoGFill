function fillForm(answers) {

    const visibleInputs = document.querySelectorAll('input:not([type="hidden"]):not(:not([type]))');

    function simulateUserInput(element, value) {
        element.focus();
        element.click();

        // if (element.type === 'radio' || element.type === 'checkbox') {
        //     element.checked = true;
        // } else {
        //     element.value = value;
        // }

        element.value = value

        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            element.dispatchEvent(event);
        });

        // Trigger a keypress event for each character
        if (typeof value === 'string') {
            value.split('').forEach(char => {
                const keyEvent = new KeyboardEvent('keypress', {
                    key: char,
                    bubbles: true,
                    cancelable: true,
                });
                element.dispatchEvent(keyEvent);
            });
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fillInputs() {
        for (let i = 0; i < visibleInputs.length && i < answers.length; i++) {
            const input = visibleInputs[i];
            await delay(100); // Add a small delay between inputs
            simulateUserInput(input, answers[i]);
        }
    }

    fillInputs().then(() => {
        console.log('Form filling complete');
        // Trigger any form-level validation or events
        const form = document.querySelector('form');
        if (form) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
        }
    });
}

// Execute the fillForm function




(async () => {
    const analyzeFormField = (headingElement) => {
        let currentElement = headingElement;
        while (currentElement && currentElement.getAttribute('role') !== 'listitem') {
            currentElement = currentElement.parentElement;
        }

        if (!currentElement) return null;

        const inputField = currentElement.querySelector('input[type="text"]');
        const emailField = currentElement.querySelector('input[type="email"]');
        const radioDiv = currentElement.querySelector('div[role="radio"]');
        const selectDiv = currentElement.querySelector('div[role="presentation"]');
        const textareaElement = currentElement.querySelector('textarea');
        const dateElement = currentElement.querySelector('input[type="date"]');

        if (inputField) {
            return { type: 'text' };
        } else if (radioDiv) {
            return { type: 'radio' };
        } else if (emailField) {
            return { type: 'email' };
        } else if (selectDiv) {
            return { type: 'select' };
        } else if (textareaElement) {
            return { type: 'textarea' };
        } else if (dateElement) {
            return { type: 'date' };
        } else {
            return { type: 'unknown' };
        }
    };

    const headings = document.querySelectorAll('div[role="heading"]');

    const formFields = Array.from(headings).map(heading => {
        const headingText = heading.textContent.trim();
        const fieldInfo = analyzeFormField(heading);
        return {
            heading: headingText,
            type: fieldInfo ? fieldInfo.type : 'unknown'
        };
    });
    const filteredFields = formFields.filter(field => field.type === "text" || field.type === "email");

    console.log(JSON.stringify(filteredFields, null, 2));

    // Make the POST API call
    const apiResponse = await fetch('https://autogfill.onrender.com/getans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredFields),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            const ansString = data.ans;

            // Parse the string into a JavaScript array and remove '\n' characters
            const cleanedArray = JSON.parse(ansString.replace(/\n/g, ''));

            console.log(cleanedArray);
            fillForm(cleanedArray);
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle any errors here
        });


})();