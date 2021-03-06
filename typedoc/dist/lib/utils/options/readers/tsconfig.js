"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Path = require("path");
var FS = require("fs");
var _ = require("lodash");
var ts = require("typescript");
var component_1 = require("../../component");
var options_1 = require("../options");
var declaration_1 = require("../declaration");
var typescript_1 = require("../sources/typescript");
var TSConfigReader = TSConfigReader_1 = (function (_super) {
    __extends(TSConfigReader, _super);
    function TSConfigReader() {
        return _super.apply(this, arguments) || this;
    }
    TSConfigReader.prototype.initialize = function () {
        this.listenTo(this.owner, options_1.DiscoverEvent.DISCOVER, this.onDiscover, -100);
    };
    TSConfigReader.prototype.onDiscover = function (event) {
        if (TSConfigReader_1.OPTIONS_KEY in event.data) {
            this.load(event, Path.resolve(event.data[TSConfigReader_1.OPTIONS_KEY]));
        }
        else if (this.application.isCLI) {
            var file = ts.findConfigFile(".", ts.sys.fileExists);
            if (file) {
                this.load(event, file);
            }
        }
    };
    TSConfigReader.prototype.load = function (event, fileName) {
        if (!FS.existsSync(fileName)) {
            event.addError('The tsconfig file %s does not exist.', fileName);
            return;
        }
        var data = ts.readConfigFile(fileName, ts.sys.readFile).config;
        if (data === undefined) {
            event.addError('The tsconfig file %s does not contain valid JSON.', fileName);
            return;
        }
        if (!_.isPlainObject(data)) {
            event.addError('The tsconfig file %s does not contain a JSON object.', fileName);
            return;
        }
        data = ts.parseJsonConfigFileContent(data, ts.sys, Path.resolve(Path.dirname(fileName)), {}, Path.resolve(fileName));
        event.inputFiles = data.fileNames;
        var ignored = typescript_1.TypeScriptSource.IGNORED;
        var compilerOptions = _.clone(data.raw.compilerOptions);
        for (var _i = 0, ignored_1 = ignored; _i < ignored_1.length; _i++) {
            var key = ignored_1[_i];
            delete compilerOptions[key];
        }
        _.merge(event.data, compilerOptions);
        if ("typedocOptions" in data) {
            _.merge(event.data, data.typedocOptions);
        }
    };
    return TSConfigReader;
}(options_1.OptionsComponent));
TSConfigReader.OPTIONS_KEY = 'tsconfig';
__decorate([
    component_1.Option({
        name: TSConfigReader_1.OPTIONS_KEY,
        help: 'Specify a js option file that should be loaded. If not specified TypeDoc will look for \'typedoc.js\' in the current directory.',
        type: declaration_1.ParameterType.String,
        hint: declaration_1.ParameterHint.File
    })
], TSConfigReader.prototype, "options", void 0);
TSConfigReader = TSConfigReader_1 = __decorate([
    component_1.Component({ name: "options:tsconfig" })
], TSConfigReader);
exports.TSConfigReader = TSConfigReader;
var TSConfigReader_1;
//# sourceMappingURL=tsconfig.js.map