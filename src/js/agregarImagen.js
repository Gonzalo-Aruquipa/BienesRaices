import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
console.log(token)

Dropzone.options.imagen = {
  dictDefaultMessage: "Sube aquí tus imágenes",
  acceptedFiles: ".png, .jpg,  .jpeg",
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: "Borrar Archivo",
  dictMaxFilesExceeded: "El límite es 1 archivo",
  Headers: {
    "CSRF-Token": token
  },
  paramName: "imagen"
};
