'use strict';

class Relations {

  constructor(db) {
    this.db = db;
  }

  load() {
    this.main();  
  }

  main() {

    this.db.main.balance.hasOne(this.db.main.users, 
      { sourceKey: 'user_id', foreignKey: 'id' }   
    );

    // this.db.main.balance_history.belongsTo(this.db.main.users, 
    //   { sourceKey: 'user_origin', foreignKey: 'id' }   
    // );

    //   this.db.main.balance_history.belongsTo(this.db.main.users, 
    //   { sourceKey: 'user_origin', foreignKey: 'id' }   
    // );
 
    this.db.main.balance_history.belongsTo(this.db.main.users, {
      as: 'userOrigin',
      foreignKey: 'user_origin'
    });

    this.db.main.balance_history.belongsTo(this.db.main.users, {
      as: 'userDestiny',
      foreignKey: 'user_destiny'
    });
 
 




    //   this.db.main.commercial_wallets.belongsTo(this.db.main.commercial_analysts, {
    //     constraints: false,
    //     foreignKey: 'responsible_analyst',
    //     targetKey: 'email'
    //   });

    //   this.db.main.commercial_analysts.hasMany(this.db.main.commercial_wallets, {
    //     constraints: false,
    //     foreignKey: 'responsible_analyst',
    //     sourceKey: 'email'
    //   });

    //   this.db.main.commercial_wallet_status_types.hasOne(this.db.main.commercial_wallet_status, {
    //     constraints: false,
    //     foreignKey: 'id'
    //   });

    //   this.db.main.commercial_wallet_status.belongsTo(this.db.main.commercial_wallet_status_types, {
    //     constraints: false,
    //     foreignKey: 'commercial_wallet_status_type_id'
    //   });

    //   this.db.main.commercial_wallet_notes.belongsTo(this.db.main.commercial_wallet_note_types, {
    //     constraints: false,
    //     foreignKey: 'note_types_id',
    //   });

    //   this.db.main.commercial_wallet_note_types.hasOne(this.db.main.commercial_wallet_notes, {
    //     constraints: false,
    //     foreignKey: 'id',
    //   });

    //   this.db.main.commercial_wallets.hasMany(this.db.main.commercial_wallet_notes, {
    //     constraints: false,
    //   });

    //   this.db.main.commercial_wallet_notes.belongsTo(this.db.main.commercial_wallets, {
    //     constraints: false,
    //   });

    //   this.db.main.commercial_wallets.hasMany(this.db.main.commercial_wallet_status, {
    //     constraints: false,
    //   });

    //   this.db.main.commercial_wallet_status.belongsTo(this.db.main.commercial_wallets, {
    //     constraints: false,
    //   });

    //   this.db.main.commercial_wallets.hasMany(this.db.main.commercial_wallet_performance_tracking, {
    //     constraints: false,
    //   });

    //   this.db.main.commercial_wallet_performance_tracking.belongsTo(this.db.main.commercial_wallets, {
    //     constraints: false,
    //   });

    //   this.db.main.communication_large_scale_status.hasMany(this.db.main.communication_large_scale, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.communication_large_scale.belongsTo(this.db.main.communication_large_scale_status, {
    //     foreignKey: 'communication_large_scale_status_id',
    //     constraints: false
    //   });

    //   this.db.main.communication_large_scale_options.hasOne(this.db.main.communication_large_scale, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.communication_large_scale.belongsTo(this.db.main.communication_large_scale_options, {
    //     foreignKey: 'communication_large_scale_options_id',
    //     constraints: false
    //   });

    //   this.db.main.communication_large_scale_notification_status.hasOne(this.db.main.communication_large_scale_notifications, {
    //     constraints: false,

    //   });

    //   this.db.main.communication_large_scale_notifications.belongsTo(this.db.main.communication_large_scale_notification_status, {
    //     constraints: false,
    //   });

    //   this.db.main.communication_large_scale.hasOne(this.db.main.communication_large_scale_notifications, {
    //     constraints: false,
    //   });

    //   this.db.main.communication_large_scale_notifications.belongsTo(this.db.main.communication_large_scale, {
    //     constraints: false,
    //   });

    //   this.db.main.rate_negotiations.belongsTo(this.db.main.rate_negotiation_status, {
    //     foreignKey: 'rate_negotiation_status_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_status.hasOne(this.db.main.rate_negotiations, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiations.belongsTo(this.db.main.rate_negotiation_reasons, {
    //     foreignKey: 'rate_negotiation_reasons_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_reasons.hasOne(this.db.main.rate_negotiations, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_billets.belongsTo(this.db.main.rate_negotiation_config_status, {
    //     foreignKey: 'rate_negotiation_config_status_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_config_status.hasOne(this.db.main.rate_negotiation_billets, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_cards.belongsTo(this.db.main.rate_negotiation_config_status, {
    //     foreignKey: 'rate_negotiation_config_status_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_config_status.hasOne(this.db.main.rate_negotiation_cards, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_cards.belongsTo(this.db.main.rate_negotiations, {
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiations.hasOne(this.db.main.rate_negotiation_cards, {
    //     as: 'rate_negotiation_cards',
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_pix.belongsTo(this.db.main.rate_negotiation_config_status, {
    //     foreignKey: 'rate_negotiation_config_status_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_config_status.hasOne(this.db.main.rate_negotiation_pix, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_pix.belongsTo(this.db.main.rate_negotiations, {
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false
    //   });


    //   this.db.main.rate_negotiations.hasOne(this.db.main.rate_negotiation_pix, {
    //     as: 'rate_negotiation_pix',
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false
    //   });




    //   this.db.main.rate_negotiation_billets.belongsTo(this.db.main.rate_negotiations, {
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false

    //   });

    //   this.db.main.rate_negotiations.hasOne(this.db.main.rate_negotiation_billets, {
    //     as: 'rate_negotiation_billets',
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_bankings.belongsTo(this.db.main.rate_negotiations, {
    //     foreignKey: 'rate_negotiations_id',
    //     constraints: false

    //   });

    //   this.db.main.rate_negotiations.hasMany(this.db.main.rate_negotiation_bankings, {
    //     foreignKey: 'rate_negotiations_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_bankings.belongsTo(this.db.main.rate_negotiation_config_status, {
    //     foreignKey: 'rate_negotiation_config_status_id',
    //     targetKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_config_status.hasOne(this.db.main.rate_negotiation_bankings, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_bankings.belongsTo(this.db.main.rate_negotiation_types, {
    //     foreignKey: 'rate_negotiation_types_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_types.hasOne(this.db.main.rate_negotiation_bankings, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_histories.belongsTo(this.db.main.rate_negotiation_config_status, {
    //     foreignKey: 'rate_negotiation_config_status_id',
    //     constraints: false
    //   });

    //   this.db.main.rate_negotiation_config_status.hasOne(this.db.main.rate_negotiation_histories, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.whatsapp_messages.belongsTo(this.db.main.whatsapp_phones, {
    //     constraints: false
    //   });

    //   this.db.main.whatsapp_phones.hasOne(this.db.main.whatsapp_messages, {
    //     constraints: false
    //   });

    //   this.db.main.control_claims.belongsTo(this.db.main.control_claim_types, {
    //     foreignKey: 'control_claim_types_id',
    //     constraints: false
    //   });

    //   this.db.main.control_claim_types.hasOne(this.db.main.control_claims, {
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.control_claims.hasMany(this.db.main.control_claim_professionals, {
    //     foreignKey: 'control_claims_id',
    //     constraints: false
    //   });

    //   this.db.main.control_claim_professionals.belongsTo(this.db.main.control_claim_professional_types, {
    //     foreignKey: 'control_claim_professional_types_id',
    //     constraints: false
    //   });

    //   this.db.main.control_claims.hasMany(this.db.main.control_claim_tickets, {
    //     foreignKey: 'control_claims_id',
    //     constraints: false
    //   });

    //   this.db.main.control_claims.hasMany(this.db.main.control_claim_comments, {
    //     foreignKey: 'control_claims_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_models.belongsTo(this.db.main.machines, {
    //     foreignKey: 'id',
    //     constraints: false

    //   });

    //   this.db.main.machine_models.hasMany(this.db.main.machine_model_checklists, {
    //     sourceKey: 'id',
    //     foreignKey: 'machine_model_id',
    //     constraints: false
    //   });

    //   this.db.main.machines.hasOne(this.db.main.machine_models, {
    //     sourceKey: 'machine_model_id',
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machines.hasOne(this.db.main.machine_manufacturers, {
    //     sourceKey: 'machine_manufacturer_id',
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machines.hasOne(this.db.main.machine_clients, {
    //     sourceKey: 'machine_client_id',
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_chips.belongsTo(this.db.main.machines, {
    //     foreignKey: 'id',
    //     constraints: false

    //   });

    //   this.db.main.machines.hasOne(this.db.main.machine_chips, {
    //     sourceKey: 'machine_chip_id',
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_chip_types.belongsTo(this.db.main.machine_chips, {
    //     foreignKey: 'id',
    //     constraints: false

    //   });

    //   this.db.main.machine_chips.hasOne(this.db.main.machine_chip_types, {
    //     sourceKey: 'machine_chip_type_id',
    //     foreignKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_logs.belongsTo(this.db.main.machines, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_id',
    //     constraints: false
    //   });

    //   this.db.main.machines.hasMany(this.db.main.machine_logs, {
    //     foreignKey: 'machine_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_coil_stock_logs.hasOne(this.db.main.machine_clients, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_client_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasOne(this.db.main.machine_order_address, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_order_address_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasOne(this.db.main.machine_clients, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_client_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasOne(this.db.main.machine_order_shipping, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_order_shipping_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasMany(this.db.main.machine_invoices, {
    //     foreignKey: 'machine_order_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_invoices.belongsTo(this.db.main.machine_orders, {
    //     foreignKey: 'machine_order_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_invoices.hasOne(this.db.main.machine_invoice_types, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_invoice_types_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasMany(this.db.main.machine_order_products, {
    //     foreignKey: 'machine_order_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_orders.hasOne(this.db.main.machine_order_shipping_settings, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_order_shipping_setting_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_order_products.hasOne(this.db.main.machines, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_order_products.hasOne(this.db.main.machine_models, {
    //     foreignKey: 'id',
    //     sourceKey: 'machine_model_id',
    //     constraints: false
    //   });

    //   this.db.main.correios_client_services.hasOne(this.db.main.correios_clients, {
    //     foreignKey: 'id',
    //     sourceKey: 'correios_client_id',
    //     constraints: false
    //   });

    //   this.db.main.correios_client_services.hasOne(this.db.main.correios_services, {
    //     foreignKey: 'id',
    //     sourceKey: 'correios_service_id',
    //     constraints: false
    //   });

    //   this.db.main.correios_services.hasMany(this.db.main.correios_client_services, {
    //     foreignKey: 'correios_service_id',
    //     sourceKey: 'id',
    //     constraints: false
    //   });

    //   this.db.main.machine_order_shipping.hasOne(this.db.main.correios_labels, {
    //     foreignKey: 'id',
    //     sourceKey: 'correios_label_id',
    //     constraints: false
    //   });

    //   this.db.main.correios_labels.hasOne(this.db.main.correios_plp, {
    //     foreignKey: 'id',
    //     sourceKey: 'correios_plp_id',
    //     constraints: false
    //   });

    //   this.db.main.machine_general_shipping_settings.hasOne(this.db.main.correios_client_services, {
    //     foreignKey: 'id',
    //     sourceKey: 'correios_client_service_id',
    //     constraints: false
    //   });

    // }

    // main_ro() { }

    // core() {

    //   this.db.core.document.hasOne(this.db.bi_intranet.carteira_comercial, {
    //     constraints: false,
    //     foreignKey: 'document_id'
    //   });

    //   this.db.core.document.belongsTo(this.db.core.profile, {
    //     constraints: false,
    //     foreignKey: 'profile_id'
    //   });

    //   this.db.core.profile.hasMany(this.db.core.document, {
    //     constraints: false,
    //     foreignKey: 'profile_id'
    //   });

    //   this.db.core.account.belongsTo(this.db.core.document, {
    //     constraints: false,
    //     foreignKey: 'document_id'
    //   });

    //   this.db.core.document.hasOne(this.db.core.account, {
    //     constraints: false,
    //     foreignKey: 'document_id'
    //   });

    //   this.db.core.user.belongsTo(this.db.core.account, {
    //     constraints: false,
    //     foreignKey: 'account_id'
    //   });

    //   this.db.core.account.hasMany(this.db.core.user, {
    //     constraints: false,
    //     foreignKey: 'account_id'
    //   });

    //   this.db.core.user.belongsTo(this.db.core.profile, {
    //     constraints: false,
    //     foreignKey: 'profile_id'
    //   });

    //   this.db.core.profile.hasMany(this.db.core.user, {
    //     constraints: false,
    //     foreignKey: 'profile_id'
    //   });

    //   this.db.core.account.hasOne(this.db.core.account_settings, {
    //     constraints: false,
    //     foreignKey: 'account_id'
    //   });

    //   this.db.core.account_settings.belongsTo(this.db.core.account, {
    //     constraints: false,
    //     foreignKey: 'account_id'
    //   });

    //   this.db.core.document.belongsTo(this.db.core.corporation, {
    //     constraints: false,
    //     foreignKey: 'corporation_id'
    //   });

    //   this.db.core.corporation.hasOne(this.db.core.document, {
    //     constraints: false,
    //     foreignKey: 'corporation_id'
    //   });

    //   this.db.core.account.hasOne(this.db.core.cnae, {
    //     constraints: false,
    //     foreignKey: 'subclass_id',
    //     sourceKey: 'primary_cnae',
    //   });
    // }

    // bi_intranet() {
    //   this.db.bi_intranet.carteira_comercial.belongsTo(this.db.core.document, {
    //     constraints: false,
    //     foreignKey: 'profile_id'
    //   });
    // }

    // reports() {
    //   this.db.reports.account_emissions_reports_federated.hasMany(this.db.reports.account_transactions_reports_federated, {
    //     constraints: false,
    //     foreignKey: 'account'
    //   });

    //   this.db.reports.account_transactions_reports_federated.hasMany(this.db.reports.account_emissions_reports_federated, {
    //     constraints: false,
    //     foreignKey: 'account'
    //   });
    // }

    // intranet() {
    //   this.db.intranet.user.hasOne(this.db.intranet.commercial_analyst, {
    //     constraints: false,
    //     foreignKey: 'id'
    //   });

    //   this.db.intranet.commercial_analyst.belongsTo(this.db.intranet.user, {
    //     constraints: false,
    //     foreignKey: 'user_id'
    //   });

    //   this.db.intranet.user.hasOne(this.db.intranet.account_analysts, {
    //     constraints: false,
    //     foreignKey: 'id'
    //   });

    //   this.db.intranet.account_analysts.belongsTo(this.db.intranet.user, {
    //     constraints: false,
    //     foreignKey: 'user_id'
    //   });

    //   this.db.intranet.user.hasMany(this.db.intranet.tickets, {
    //     constraints: false,
    //     foreignKey: 'owner_id',
    //     sourceKey: 'id',
    //   });

    //   this.db.intranet.tickets.hasMany(this.db.intranet.messages, {
    //     constraints: false,
    //     foreignKey: 'ticket_id',
    //     sourceKey: 'id',
    //   });
    // }

    // inteligencia_operacoes() {
    //   this.db.inteligencia_operacoes.pos_alert.hasOne(this.db.inteligencia_operacoes.type_alert_pos, {
    //     constraints: false,
    //     foreignKey: 'id',
    //     sourceKey: 'type_alert_pos_id'
    //   });

    //   this.db.inteligencia_operacoes.type_alert_pos.belongsTo(this.db.inteligencia_operacoes.pos_alert, {
    //     constraints: false,
    //     foreignKey: 'id',
    //     sourceKey: 'type_alert_pos_id'
    //   });


    // }
  }
}

module.exports = Relations;
