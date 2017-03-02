'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var sanitizeMetadata = require('./sanitizeMetadata');

var Paragraph = function Paragraph(id, data) {
  if (id === undefined) {
    throw new Error('Id is missing.');
  }
  if (!data) {
    throw new Error('Data is missing.');
  }
  if (!data.host) {
    throw new Error('Host is missing.');
  }
  if (!data.level) {
    throw new Error('Level is missing.');
  }
  if (!data.message) {
    throw new Error('Message is missing.');
  }
  if (data.metadata && _typeof(data.metadata) !== 'object') {
    throw new Error('Invalid metadata.');
  }

  this.host = data.host;
  this.pid = process.pid;
  this.id = id;
  this.timestamp = Date.now();
  this.level = data.level;
  this.message = data.message;

  if (data.application) {
    this.application = data.application;
  }
  if (data.module) {
    this.module = data.module;
  }
  if (data.source) {
    this.source = data.source;
  }
  if (data.metadata) {
    this.metadata = sanitizeMetadata(data.metadata);
  }
};

module.exports = Paragraph;