'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const ferragens = [
      "Parafuso Sextavado 1/4 x 2",
      "Porca Sextavada 1/4",
      "Arruela Lisa 1/4",
      "Bucha de Nylon 8mm",
      "Prego com Cabeça 18x27",
      "Martelo Unha Cabo Madeira",
      "Alicate Universal 8 Pol",
      "Chave de Fenda 1/4 x 6",
      "Chave Phillips 1/8 x 4",
      "Serra Mármore 1100W",
      "Furadeira de Impacto 1/2",
      "Broca Aço Rápido 6mm",
      "Broca para Concreto 8mm",
      "Disco de Corte Inox 4.1/2",
      "Lixa para Ferro Grão 80",
      "Trena de Aço 5m",
      "Nível de Alumínio 12 Pol",
      "Esquadro de Aço 10 Pol",
      "Cadeado de Latão 30mm",
      "Fechadura Externa Inox",
      "Dobradiça de Aço 3 Pol",
      "Puxador de Porta Cromado",
      "Trinco para Porta Zincado",
      "Cantoneira L 2x2 Pol",
      "Mão Francesa 20cm",
      "Corrente Soldada 5mm",
      "Corda de Polipropileno 8mm",
      "Fita Isolante 20m",
      "Fita Veda Rosca 18mm",
      "Silicone Acético Transparente",
      "Espuma Expansiva 500ml",
      "Cola para Cano PVC",
      "Luva de PVC 25mm",
      "Cotovelo de PVC 25mm",
      "Tê de PVC 25mm",
      "Registro de Esfera 3/4",
      "Torneira de Jardim 1/2",
      "Chuveiro Elétrico 5500W",
      "Lâmpada LED 9W Branca",
      "Soquete E27 Cerâmica",
      "Interruptor Simples 1 Tecla",
      "Tomada 2P+T 10A",
      "Disjuntor Monopolar 20A",
      "Cabo Flexível 2.5mm Vermelho",
      "Cabo Flexível 2.5mm Azul",
      "Eletroduto Corrugado 3/4",
      "Caixa de Luz 4x2",
      "Pincel de Cerdas Pretas 2 Pol",
      "Rolo de Lã para Pintura 23cm",
      "Tinta Acrílica Branca 18L"
    ];

    const products = ferragens.map((name, index) => ({
      name: name,
      description: `Item de alta qualidade: ${name}`,
      price: (Math.random() * 100 + 5).toFixed(2),
      stockQuantity: Math.floor(Math.random() * 200),
      minStockLevel: 10,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
