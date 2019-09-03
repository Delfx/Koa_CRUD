function update() {
    const selectForm = document.getElementsByClassName('changeForm');
    for (const changeForm of selectForm) {

        changeForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const allForms = changeForm.parentNode;
            const createInput = document.createElement('input');
            const createSubmitButton = document.createElement('button');
            const createForm = document.createElement('form');
            const createHidden = document.createElement('input');
            const getId = allForms.getElementsByClassName('id');

            createHidden.name = 'id';
            createHidden.value = getId[0].defaultValue;
            createHidden.type = ('hidden');

            createForm.method = 'post';
            createForm.action = ('/update');
            createForm.className = 'update d-inline';

            createInput.setAttribute('type', ('text'));
            createInput.classList.add('form-control');
            createInput.value = allForms.querySelector('span').textContent;
            createInput.name = 'changeThing';

            createSubmitButton.innerText = 'Ok';
            createSubmitButton.className = 'btn-danger btn btn-sm mt-2';

            createForm.appendChild(createInput);
            createForm.appendChild(createSubmitButton);
            createForm.appendChild(createHidden);


            for (const form of allForms.querySelectorAll('form')) {
                form.style.display = 'none';
                form.classList.remove('d-inline');
            }

            allForms.appendChild(createForm);

            const selectUpdateForm = document.getElementsByClassName('update');
            for (const updateForm of selectUpdateForm) {
                updateForm.addEventListener('submit', async function (event) {
                    event.preventDefault();

                    const updateData = new URLSearchParams(new FormData(updateForm));

                    await fetch('/update', {
                        method: 'post',
                        body: updateData
                    });

                    for (const form of allForms.querySelectorAll('form')) {
                        form.style.display = 'block';
                        form.classList.add('d-inline');
                    }

                    const selectInputValue = event.target.querySelector('input').value;
                    event.target.parentNode.querySelector('span').innerHTML = selectInputValue;
                    event.target.remove();
                })
            }
        })
    }
}

update();