'use strict';

const { handler, API } = require('vercel-serverless-api');
const Handlebars = require('handlebars');

class IndexAPI extends API {

	static get template() {
		// eslint-disable-next-line max-len
		return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="https://www.w3.org/1999/xhtml" style="height:100%;"><head><title>Rescuefy Notify Service</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0 "><style>*::after{box-sizing:border-box}*:before{box-sizing:border-box}.{{proyectName}}-main__footer-rescuefy:hover{color:#{{colorHover}} !important}</style></head><body class="{{proyectName}}-main__body" style="box-sizing:border-box;font-family:sans-serif;text-align:center;background-color:#{{colorBackground}};height:100%;min-width:fit-content;margin:0;"><table class="{{proyectName}}-main__container" style="box-sizing:border-box;border-spacing:0;margin:auto;height:675px;max-width:640px;width:90%;padding:0 10px;"><thead style="box-sizing:border-box;"><th class="{{proyectName}}-main__header" style="box-sizing:border-box;padding:0px;margin:0;padding:86px 0 56px 0;"><a href="https://github.com/{{githubUser}}/{{proyectName}}-service" alt="{{proyectName}} Service Link" target="_blank"><img src="{{serviceBanner}}" alt="logo-{{proyectName}}" style="box-sizing:border-box;width:100%;"></a></th></thead><tfoot style="box-sizing:border-box;"><tr style="box-sizing:border-box;"><td class="{{proyectName}}-main__footer" style="box-sizing:border-box;padding:0px;margin:0;padding:43px 0 28px 0;"><a href="https://github.com/{{githubUser}}" class="{{proyectName}}-main__footer-rescuefy" style="box-sizing:border-box;font-size:18px;color:#{{colorBrand}};font-weight:500;margin-bottom:20px;display:inline-block;text-decoration:none;">{{owner}} en Github</a><p class="{{proyectName}}-main__footer-text" style="box-sizing:border-box;color:#{{colorDisclaimer}};font-size:8px;line-height:13px;font-weight:400;margin:0;">Copyright &copy; {{year}} {{owner}}</p><p class="{{proyectName}}-main__footer-text" style="box-sizing:border-box;color:#{{colorDisclaimer}};font-size:8px;line-height:13px;font-weight:400;margin:0;">Buenos Aires, Argentina</p><p class="{{proyectName}}-main__footer-text" style="box-sizing:border-box;color:#{{colorDisclaimer}};font-size:8px;line-height:13px;font-weight:400;margin:0;">Consulte la Wiki!</p></td></tr></tfoot></table><hr class="{{proyectName}}-main__footer-line" style="box-sizing:border-box;height:4px;background-color:#{{colorFooterLine}};border:none;margin:0;"></body></html>';
	}

	static get config() {

		return {
			proyectName: 'notify',
			serviceBanner: 'https://user-images.githubusercontent.com/89747340/132135868-755c19bf-4313-40cf-a997-1710705e6142.png',
			githubUser: 'Rescuefy-admin',
			owner: 'Rescuefy',
			year: new Date().getFullYear(),
			colorBrand: '5e4af9',
			colorHover: '6c2650',
			colorBackground: '9ae2fe',
			colorDisclaimer: '5e4af9',
			colorFooterLine: '5e4af9'
		};
	}

	process() {
		const indexTemplate = Handlebars.compile(this.constructor.template);
		this.setHeader('Content-Type', 'text/html').setBody(indexTemplate(this.constructor.config));
	}
}

module.exports = async (...args) => handler(IndexAPI, ...args);
