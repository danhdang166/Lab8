$(document).ready(function(){
    let Staffs , Depts;
    $.get(
        'http://45.76.156.126/getdata.php',
        {Type: 'Staff'},
        function(data){
            staffs = data;
            staffs.sort(compareObject);
            ShowStudent(staffs);
            console.log(staffs);
        },'Json'
    );
    $.get(
        'http://45.76.156.126/getdata.php',
        {Type: 'Department'},
        function(data){
            depts = data;
            ShowDepts(depts);
            console.log(depts);
        },'Json'
    );

    function ShowStudent(_studentList){
        let _str ='', i = 0;
        for(let _p of _studentList){
            _str += `
            <div class="row">
                    <div class="col-sm-1">${++i}</div>
                    <div class="col-sm-4 students-name">${_p.FistName + " " +_p.LastName }</div>
                    <div class="col-sm-4">${_p.Department}</div>
                    <div class="col-sm-3">
                        <button type="button" class="btn Edit"data-id='${_p.ID}'>Edit</button>
                        <button type="button" class="btn Delete" data-id='${_p.ID}'>Delete</button>
                    </div>
                </div>`
        }
        $('.group-List').html('');
        $('.group-List').append(_str);
    }

    function ShowDepts(_deptsList){
        let _str ='', _option = '';
        for(let p of _deptsList){
            _str +=`<li> ${ p } </li>`;
            _option +=`<option value=" ${p}">${p}</option>`
        }
        $('.list-department').append(_str);
        $('#Dept').append(_option);
    }

    $('#add').click(function(){
        let _id = $('#id').val();
        let _firstName = $('#FirstName').val();
        let _lastName = $('#LastName').val();
        let _Dept = $('#Dept').val();

        staffs.unshift({
            'ID' : id,
            'FistName': _firstName,
            'LastName': _lastName,
            'Email':"",
            'Department': _Dept
        });
        ShowStudent(staffs);
    });

    function compareObject(a , b) {
        if(a.LastName < b.LastName) return -1;
        if(a.FistName > b.FistName) return 1;
    }

    $("#search-id").on("keyup", function() {
        let _val = $("#search-id").val().toLowerCase();
        if(_val != ""){
            let listStudents = new Array();
            for(let i of staffs){
                var _firstname = i.FistName.toLowerCase() ;
                var _lastname = i.LastName.toLowerCase()
                _firstname.concat(" ", i.LastName.toLowerCase());
                if ((_lastname.indexOf(_val) > -1) || (_firstname.indexOf(_val) > -1)) {
                    listStudents.push(i);
                }
            }
            ShowStudent(listStudents);
        }else {
            ShowStudent(staffs);
        }
    }); 

    $('.group-List').on('click', '.Delete', function(e) {
        let _confirm = confirm('Are you sure?');
        if(_confirm){
            let _node = e.target;
            _node = $(_node);
            let _id = _node.attr('data-id');

            for(let _index in staffs){
                if(_id == staffs[_index].ID){
                    staffs.splice(_index,1);
                    break;
                }
            }
            ShowStudent(staffs);
        }
    });

    $('.list-department').on('click', 'li', function(ele){
        let _node = ele.target;
        _node = $(_node);
        let _deptName = _node.text();

        let list = [];
        for(let _d of staffs){
            if(_d.Department == _deptName){
                list.push(_d);
            }
        }
        ShowStudent(list);
    });

    $('.group-List').on('click', '.Edit', function(e) {
        $("#add").css('display','none');
        $("#update").css('display','block');
        let _node = e.target;
        _node = $(_node);
        let _id = _node.attr('data-id');

        var _index = 0;
        for(_index in staffs){
            if(_id === staffs[_index].ID){
                $('#id').val(staffs[_index].ID);
                $('#FirstName').val(staffs[_index].FistName);
                $('#LastName').val(staffs[_index].LastName);
                $('#Dept').val(` ${staffs[_index].Department}`);
                break;
            }
        }
        $('#update').click(function(){
            $("#add").css('display','block');
            $("#update").css('display','none');
            staffs.splice(_index,1,{
                'ID' : $('#id').val(),
                'FistName': $('#FirstName').val(),
                'LastName': $('#LastName').val(),
                'Email':"",
                'Department':$('#Dept').val()
            });
            $('#id').val("");
            $('#FirstName').val("");
            $('#LastName').val("");
            $('#Dept').val("");
            ShowStudent(staffs);
        });
    });
});
