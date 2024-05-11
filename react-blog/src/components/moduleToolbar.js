

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // botones alternados
    ['blockquote'],

    [{ 'header': 1 }, { 'header': 2 }],               // valores de botones personalizados

    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],     
    [{ 'indent': '-1' }, { 'indent': '+1' }],         
    [{ 'direction': 'rtl' }],                         //direccion del texto

   
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // menu desplegable
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // eliminar formato
];

export const modules = {
    toolbar: toolbarOptions,
};