$(function () {
  const baseUrl = "https://61c9b5bb20ac1c0017ed8db4.mockapi.io/api/"
  const createCategory = $('#create-category')
  const createProduct = $('#create-product')
  const modalCreateProduct = $('#modal-create-product')
  let categoriesList = []

  const getCategoryName = (id) => categoriesList.find((c) => c.id === id)

  const mountProductsList = (list) => {
    const html = list.map((item) => (`<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${getCategoryName(item.category).name}</td>
        <td>${item.description}</td>
      </tr>`
    ))

    $("#products-list tbody").html(html)
  }

  const loadProducts = () => {
    const products = axios.get(`${baseUrl}/products`)
    const categories = axios.get(`${baseUrl}/categories`)

    Promise.all([products, categories]).then((values) => {
      categoriesList = values[1].data
      mountProductsList(values[0].data)
    })
  }

  const mountCategoriesSelect = (list) => {
    const html = list.map((item) => (`<option value="${item.id}">${item.name}</option>`))
    $("#categories-select").html(html)
  }

  createCategory.submit(function(event) {
    const serialized = createCategory.serializeArray()
    const formData = {}

    serialized.forEach((item) => {
      formData[item.name] = item.value
    })

    $('.fa-spinner').removeClass('d-none')
    $('.save-btn').attr('disabled', true)
    $.post(`${baseUrl}/categories`, formData, (res) => {
      $('.fa-spinner').addClass('d-none')
      $('.save-btn').removeAttr('disabled')
      createCategory.trigger('reset').find('input:first').focus()
    })

    event.preventDefault()
  })

  createProduct.submit(function(event) {
    const serialized = createProduct.serializeArray()
    const formData = {}

    serialized.forEach((item) => {
      formData[item.name] = item.value
    })

    $('.fa-spinner').removeClass('d-none')
    $('.save-btn').attr('disabled', true)
    $.post(`${baseUrl}/products`, formData, (res) => {
      $('.fa-spinner').addClass('d-none')
      $('.save-btn').removeAttr('disabled')
      loadProducts()
      createProduct.trigger('reset').find('input:first').focus()
    })

    event.preventDefault()
  })

  modalCreateProduct.on("show.bs.modal", function() {
    $.get(`${baseUrl}/categories`, (res) => {
      mountCategoriesSelect(res)
    })
  })

  loadProducts()
})