using System.Net;
using System.Net.Http;
using System.Text;
using Umbraco.Web.WebApi;

namespace Umbraco.Mini8.Controllers
{
    public class EastereggController : UmbracoApiController
    {
        [System.Web.Http.HttpGet]
        public HttpResponseMessage GiveMeAnEasteregg(string guess)
        {
            var html = "";

            switch (guess)
            {
                case "unicorn":
                    html = "<script>$(function() {$('body').append(\"<div class='unicorn easteregg'> <div class='unicorn__item'> <div class='unicorn__image'><img src='/images/unicorn.gif'></div> </div> </div>\"); });</script>";
                    break;
                case "niels":
                    html = "<script>!function(a){a.fn.raptorize=function(b){var c={enterOn:\"click\",delayTime:5e3},b=a.extend(c,b);return this.each(function(){function h(){function b(){document.getElementById(\"elRaptorShriek\").play()}f=!0,b(),g.animate({bottom:\"0\"},function(){a(this).animate({bottom:\"-130px\"},100,function(){var b=a(this).position().left+400;a(this).delay(300).animate({right:b},2200,function(){g=a(\"#elRaptor\").css({bottom:\"-700px\",right:\"0\"}),f=!1})})})}var c=a(this),d='<img id=\"elRaptor\" style=\"display: none\" src=\"/images/raptor.jpg\" />',e='<audio id=\"elRaptorShriek\" preload=\"auto\"><source src=\"/images/raptor-sound.mp3\" /><source src=\"/images/raptor-sound.ogg\" /></audio>',f=!1;a(\"body\").append(d),a(\"body\").append(e);var g=a(\"#elRaptor\").css({position:\"fixed\",bottom:\"-700px\",right:\"0\",display:\"block\"});if(\"timer\"==b.enterOn)setTimeout(h,b.delayTime);else if(\"click\"==b.enterOn)c.bind(\"click\",function(a){a.preventDefault(),f||h()});else if(\"konami-code\"==b.enterOn){var i=[],j=\"38,38,40,40,37,39,37,39,66,65\";a(window).bind(\"keydown.raptorz\",function(b){i.push(b.keyCode),i.toString().indexOf(j)>=0&&(h(),a(window).unbind(\"keydown.raptorz\"))},!0)}})}}(jQuery);$(function() {$('.c-page__title').raptorize({'enterOn' : 'timer', 'delayTime' : 0 }); });</script>";
                    html = "$('body').raptorize({'enterOn': 'timer', 'delayTime': 1000}); ";
                    break;
                case "blackwhite":
                    html = "<script>$(function() {$(function() { $('body').addClass('black-white'); }); });</script>";
                    break;
                case "flip":
                    html = "<script>$(function() { $('body').addClass('flip');});</script>";
                    break;
                case "clear":
                    html = "<script>$(function() {$(function() { $('.easteregg').remove(); }); });</script>";
                    break;
                case "banana":
                    html = "<script>$(function() {$('body').append(\"<div class='banana easteregg'> <div class='banana__item'> <div class='banana__image'><img src='/images/banaan.png'></div> </div> </div>\"); });</script>";
                    break;
                case "rotate":
                    html = "<script>$(function() { $('body').addClass('rotate');});</script>";
                    break;
                case "comicsans":
                    html = "<script>$(function() {$(function() { $('body').addClass('comic-sans'); }); });</script>";
                    break;
                default:
                    break;
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(html, Encoding.UTF8, "text/html")
            };
        }
    }
}