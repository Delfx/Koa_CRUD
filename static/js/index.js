function update() {
    const selectForm = document.getElementsByClassName('changeForm');
    console.log(selectForm);

    for (const updateForm of selectForm){
         updateForm.addEventListener('submit', async function (event) {
             event.preventDefault();


         })
    }
}

update();