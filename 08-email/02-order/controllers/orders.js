const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
    const newOrder = new Order({
        user: ctx.user._id,
        product: ctx.request.body.product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address
    })
    const product = await Product.findById(newOrder.product)
    const savedOrder = await newOrder.save();

    await sendMail(
        {
            template: 'order-confirmation',
            to: ctx.user.email,
            subject: 'Подтверждение заказа',
            locals: {
                id: savedOrder._id,
                product: product
            }
        })

    ctx.body = {order: savedOrder._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user._id});
    ctx.body = {orders}
};
