const title       = $('#task-title');
const description = $('#task-desc');
const finishBy    = $('#task-date');
const editTitle       = $('#edit-task-title');
const editDescription = $('#edit-task-description');
const editFinishBy    = $('#edit-task-date');
const addTaskForm = $('.add-task-form');
const editTaskForm= $('.edit-task-form');
const modalContain= $('.add-modal-container');
const editModal   = $('.edit-modal-container');
const addTaskAll  = $('.add-task-all');
const addTaskDay  = $('.add-task-day');
const taskPage    = $('.task-display-pg');
const searchBar   = $('.search-bar');
const searchInput = $('#search-input');
const searchDateInput = $('#search-date-input');
const dayTaskContainer= $('.task-content-day');
const allTaskContainer= $('.task-content-all');

searchBar.on('click', '#search-submit', function (e) {
    const params = { search: searchInput.val().trim() };
    $.ajax({
        method: 'GET',
        url: `/tasks/search/?${ jQuery.param(params) }`
    })
    .done(function(tasks) {
        allTaskContainer.empty();
        dayTaskContainer.empty();

        tasks.forEach(function (task) {
            if (task.finishBy) {
                task.finishBy = new Date(task.finishBy + " PST").toDateString();
            }
            else {
                task.finishBy = "N/A";
            }
            let allOrDay = 'all';
            if (task.inProg === true) 
                allOrDay = 'day';
            addTask(task.title, task.finishBy, task.description, task.id, allOrDay);
        });
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to complete search. Please try again later.");
    });

});
searchBar.on('click', '#search-date-submit', function (e) {
    let searchBy = searchDateInput.val();
    if (searchBy)
        searchBy = new Date(searchBy).toISOString().substr(0,10);
    const params = { search: searchBy };
    $.ajax({
        method: 'GET',
        url: `/tasks/searchdate/?${ jQuery.param(params) }`
    })
    .done(function(tasks) {
        allTaskContainer.empty();
        dayTaskContainer.empty();

        tasks.forEach(function (task) {
            if (task.finishBy) {
                task.finishBy = new Date(task.finishBy + " PST").toDateString();
            }
            else {
                task.finishBy = "N/A";
            }
            let allOrDay = 'all';
            if (task.inProg === true) 
                allOrDay = 'day';
            addTask(task.title, task.finishBy, task.description, task.id, allOrDay);
        });
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to complete search. Please try again later.");
    });
    
});
taskPage.on('click', '.btn-delete', function (e) {
    const id = $(this).parent().attr('data-task-id');
    const button = $(this);

    $.ajax({
        method: 'DELETE',
        url: `/tasks/${id}`
    })
    .done(function(response) {
        button.parent().remove();
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to delete task. Please try again later.");
    });
});
taskPage.on('click', '.btn-task-switcher', function (e) {
    const id = $(this).parent().attr('data-task-id');
    const inProg = $(this).parent().attr('data-task-inProg');
    const button = $(this);

    $.ajax({
        method: 'PATCH',
        url: `/tasks/${id}/inProg`,
        data: {
            inProg: inProg
        }
    })
    .done(function(response) {
        const description = button.parent().attr('data-task-description');
        const finishBy    = button.siblings('.task-date').text();
        const title       = button.siblings('.task-title').text();
        button.parent().remove();
        // add task to other container
        let allOrDay = 'day'
        if (inProg === 'true') {
            allOrDay = 'all';
        }
        addTask(title, finishBy, description, id, allOrDay);
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to move task. Please try again later.");
    });
});
taskPage.on('click', '.btn-edit', function(e) {
    const button     = $(this);
    const id         = button.parent().attr('data-task-id');
    const title      = button.siblings('.task-title').text();
    const description= button.parent().attr('data-task-description');
    const finishBy   = button.siblings('.task-date').text();
    editTaskForm.attr('form-task-id', id)

    $('#edit-task-title').val(title);
    $('#edit-task-description').val(description);
    if (finishBy !== 'N/A')
        $('#edit-task-date').val(new Date(finishBy).toISOString().substr(0,10));
    else
        $('#edit-task-date').val('');
    editModal.addClass('show');
});
addTaskAll.click(function(e) {
    modalContain.addClass('show');
    addTaskForm.attr('day', 'false');
});
addTaskDay.click(function(e) {
    modalContain.addClass('show');
    addTaskForm.attr('day', 'true');
});
modalContain.on('click', '.modal-background', function(e) {
    modalContain.removeClass('show');
});
$(".add-task-container").on('click', '.close-form', function(e) {
    modalContain.removeClass('show');
});
editModal.on('click', '.modal-background', function(e) {
    editModal.removeClass('show');
});
$(".edit-task-container").on('click', '.close-form', function(e) {
    editModal.removeClass('show');
});
addTaskForm.submit(function(e) {
    e.preventDefault();
    var formData = {
        title   : title.val(),
        desc    : description.val(),
        finishBy: finishBy.val(),
        inProg  : addTaskForm.attr('day')
    };
    $.ajax({
        method: 'POST',
        url:    '/tasks',
        data:   formData
    })
    .done(function(newTask) {
        let allOrDay = 'all'
        if (formData.inProg === 'true') {
            allOrDay = 'day';
        }
        if (newTask.finishBy) {
            newTask.finishBy = new Date(newTask.finishBy + " PST").toDateString();
        }
        else {
            newTask.finishBy = "N/A";
        }
        addTask(newTask.title, newTask.finishBy, newTask.description, newTask.id, allOrDay);
        modalContain.removeClass('show');
        clearTaskForm();
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to add task. Please try again later.");
    });
});
editTaskForm.submit(function(e) {
    e.preventDefault();
    const id = $(this).attr('form-task-id');
    var formData = {
        title   : editTitle.val(),
        desc    : editDescription.val(),
        finishBy: editFinishBy.val(),
    };
    $.ajax({
        method: 'PATCH',
        url:    `/tasks/${id}`,
        data:   formData
    })
    .done(function(response) {
        // Dynamically redisplay task container contents
        if (formData.finishBy) {
            formData.finishBy = new Date(formData.finishBy + " PST").toDateString();
        }
        else {
            formData.finishBy = "N/A";
        }
        const task = $(`div[data-task-id=${id}]`)
        task.children('.task-title').html(formData.title);
        task.children('.task-date').html(formData.finishBy);
        task.attr('data-task-description', formData.desc);

        editModal.removeClass('show');
    })
    .fail(function(err) {
        console.log(err);
        alert("Unable to edit task. Please try again later.");
    });
});

var addTask = (title, date, description, id, allOrDay) => {
    let inProg = "true";
    if (allOrDay === "all")
        inProg = "false";
    $(`.task-content-${allOrDay}`).append(
    `<div class="task-singular-container" data-task-inProg=${inProg} data-task-id="${id}" data-task-description="${description}">
        <button class="btn-delete"><i class="fas fa-minus-circle"></i></button>
        <button class="btn-edit"><i class="fas fa-pencil-alt"></i></button>
        <p class="task-title">${title}</p>
        <p class="task-date">${date}</p>
        <i class="fas fa-arrows-alt-v btn-task-switcher"></i>
    </div>`);
};

var clearTaskForm = () => {
    title.val('');
    description.val('');
    finishBy.val('');
};