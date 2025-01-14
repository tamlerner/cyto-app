const { createClient } = require('@supabase/supabase-js')
const supabase_url = NEXT_PUBLIC_SUPABASE_URL
const supabase_key = NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabase_url, supabase_key)

const getRates = async () => {
  console.log('Deleting previous exchange rates');
  const { error:errorDeleting } = await supabase
  .from('exchange_rates')
  .delete().neq("bank_name", "prout")
  

  if(errorDeleting){
    console.log(errorDeleting)
  }

    const response = await fetch("https://cambiang.com/cambiangpyapi/read_cambio/last")
    const data = await response.text()
    
    const rates = Object.entries(JSON.parse(data)).map(([bank_name, item]) => {

    const euro_sell = item.cambios.find(cambio => cambio[0].currencyType === "EUR" && cambio[0].typeOfCambio === "COMPRA")
    const euro_buy = item.cambios.find(cambio => cambio[0].currencyType === "EUR" && cambio[0].typeOfCambio === "VENDA")
    const dollar_sell = item.cambios.find(cambio => cambio[0].currencyType === "USD" && cambio[0].typeOfCambio === "COMPRA")
    const dollar_buy = item.cambios.find(cambio => cambio[0].currencyType === "USD" && cambio[0].typeOfCambio === "VENDA")

    return {
        bank_name: bank_name,
        euro_sell: euro_sell?.[0].amount,
        euro_buy: euro_buy?.[0].amount,
        dollar_sell: dollar_sell?.[0].amount,
        dollar_buy: dollar_buy?.[0].amount
    }
})

const { data:result, error } = await supabase
  .from('exchange_rates')
  .insert(rates)
  .select()

  

  if(error){
    console.log("oupsi 🫡", error)
  }else{
    console.log("Rates updated ! 👀")
  }
}

setInterval(getRates, 2000)

getRates()
