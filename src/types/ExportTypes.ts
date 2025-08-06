interface ExportMode {
    createExportStream: () =>  Buffer;
    saveFile: () => void;
}
