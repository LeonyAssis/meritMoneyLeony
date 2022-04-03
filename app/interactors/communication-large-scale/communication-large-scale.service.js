class CommunicationLargeScaleService {


  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
  }
  async formatObjectByProperty(objectList, objectProperty) {
    let list = [];

    objectList.forEach(doc => {
      if (doc[objectProperty] != undefined)
        list.push(doc[objectProperty]);
    });

    return list;
  }

  async getCommunicationLargeScaleOptions(req) {
    let communication_large_scale_options = {};

    communication_large_scale_options.subject = req.subject;
    communication_large_scale_options.communication_type = req.communication_type;
    communication_large_scale_options.message = req.message;
    communication_large_scale_options.type_from = req.type_from;
    communication_large_scale_options.ticket_create_note = req.create_note || 0;
    communication_large_scale_options.ticket_owner_id = req.owner_id;
    communication_large_scale_options.ticket_queue_id = req.queue_id;
    communication_large_scale_options.ticket_classification_type_id = req.classification_type_id;
    communication_large_scale_options.ticket_avaliation_status_id = req.avaliation_status_id;
    communication_large_scale_options.ticket_category_id = req.category_id;
    communication_large_scale_options.ticket_subject_id = req.subject_id;
    communication_large_scale_options.ticket_archive = req.archive;
    communication_large_scale_options.video_url = req.video_url;

    return communication_large_scale_options;
  }

  async getCommunicationLargeScale(req, communication_large_scale_options_id) {
    let communication_large_scale_options = {};

    communication_large_scale_options.communication_large_scale_options_id = communication_large_scale_options_id;
    communication_large_scale_options.user_id = req.user_id;
    communication_large_scale_options.from = req.from.toString();
    communication_large_scale_options.total_amount_to_process = req.from.length;
    communication_large_scale_options.total_amount_processed = 0;
    communication_large_scale_options.scheduled_at = req.scheduled_at;
    communication_large_scale_options.started_at = req.started_at;
    communication_large_scale_options.finished_at = req.finished_at;
    communication_large_scale_options.communication_large_scale_status_id = req.communication_large_scale_status_id || (req.scheduled_at ? 6 : 1);

    return communication_large_scale_options;
  }

  async sendTicketCommunication(passkey, communication_large_scale, account) {

    let owner_id = communication_large_scale.communication_large_scale_option.ticket_queue_id != null ? communication_large_scale.communication_large_scale_option.ticket_queue_id : communication_large_scale.communication_large_scale_option.ticket_owner_id;

    const uri = `${this.config.intranet.url}/ws/ticket/create`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          ticket: {
            passkey: passkey,
            label: 'Gerencianet',
            ticket_subject: communication_large_scale.communication_large_scale_option.subject,
            account: account
          },
          message: {
            content: communication_large_scale.communication_large_scale_option.message
          },
          app: 'Sistema',
          large_scale: {
            owner_id: owner_id,
            subject_id: communication_large_scale.communication_large_scale_option.ticket_subject_id,
            rating_id: communication_large_scale.communication_large_scale_option.ticket_avaliation_status_id,
            classification_type_id: communication_large_scale.communication_large_scale_option.ticket_classification_type_id,
            category_id: communication_large_scale.communication_large_scale_option.ticket_category_id,
            create_note: communication_large_scale.communication_large_scale_option.ticket_create_note,
            archive: communication_large_scale.communication_large_scale_option.ticket_archive,
            video_url: communication_large_scale.communication_large_scale_option.video_url
          }
        }
      },
      json: true
    };
    try {
      let resp = await this.rp(options);
      return resp;
    } catch (err) {
      console.log(err);
    }
  }

  async sendTicketCommunicationProfile(profile_id, communication_large_scale) {

    let owner_id = communication_large_scale.communication_large_scale_option.ticket_queue_id != null ? communication_large_scale.communication_large_scale_option.ticket_queue_id : communication_large_scale.communication_large_scale_option.ticket_owner_id;

    const uri = `${this.config.intranet.url}/ws/ticket/create`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          ticket: {
            profile_id: profile_id,
            label: 'Gerencianet',
            ticket_subject: communication_large_scale.communication_large_scale_option.subject,
          },
          message: {
            content: communication_large_scale.communication_large_scale_option.message
          },
          app: 'Sistema',
          large_scale: {
            owner_id: owner_id,
            subject_id: communication_large_scale.communication_large_scale_option.ticket_subject_id,
            rating_id: communication_large_scale.communication_large_scale_option.ticket_avaliation_status_id,
            classification_type_id: communication_large_scale.communication_large_scale_option.ticket_classification_type_id,
            category_id: communication_large_scale.communication_large_scale_option.ticket_category_id,
            create_note: communication_large_scale.communication_large_scale_option.ticket_create_note,
            archive: communication_large_scale.communication_large_scale_option.ticket_archive,
            video_url: communication_large_scale.communication_large_scale_option.video_url
          }
        }
      },
      json: true
    };
    try {
      let resp = await this.rp(options);
      return resp;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = CommunicationLargeScaleService;
