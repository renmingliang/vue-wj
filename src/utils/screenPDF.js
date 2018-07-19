import html2canvas from 'html2canvas'
const jsPDF = require('jspdf')

/**
 * 截图 // screenPDF - promise语法
 * @param {String} title 问卷标题
 * @param {String} type_name 问卷类型
 * @param {String} ele DOM容器元素
 */

function screenPDF(title, type_name, ele) {
  return new Promise((resolve, reject) => {
    html2canvas(ele).then(function (canvas) {
      var contentWidth = canvas.width
      var contentHeight = canvas.height

      // 一页pdf显示html页面生成的canvas高度;
      var pageHeight = contentWidth / 592.28 * 841.89
      // 未生成pdf的html页面高度
      var leftHeight = contentHeight
      // 页面偏移
      var position = 0
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      // 这里进行20边距
      var imgWidth = 555.28
      var imgHeight = 555.28 / contentWidth * contentHeight

      var pageData = canvas.toDataURL('image/jpeg', 1.0)
      /* eslint-disable new-cap */
      var pdf = new jsPDF('', 'pt', 'a4')

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 841.89
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save(`${title}-${type_name}.pdf`)

      resolve()
    })
  })
}

export default screenPDF
