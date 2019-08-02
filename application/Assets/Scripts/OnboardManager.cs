using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class OnboardManager : MonoBehaviour
{
    public RectTransform OnBoard1, OnBoard2, OnBoard3, OnBoard4;

    // Start is called before the first frame update
    void Start()
    {
        OnBoard1.DOAnchorPos(Vector2.zero, 0.25f);
    }

    // Update is called once per frame
    public void OnBoard1Next()
    {
        OnBoard1.DOAnchorPos(new Vector2(-1080, 0), 0.25f);
        OnBoard2.DOAnchorPos(new Vector2(0, 0), 0.25f);
    }

    public void OnBoard2Back()
    {
        OnBoard1.DOAnchorPos(new Vector2(0, 0), 0.25f);
        OnBoard2.DOAnchorPos(new Vector2(1080, 0), 0.25f);
    }

    public void OnBoard2Next()
    {
        OnBoard2.DOAnchorPos(new Vector2(-1080, 0), 0.25f);
        OnBoard3.DOAnchorPos(new Vector2(0, 0), 0.25f);
    }

    public void OnBoard3Back()
    {
        OnBoard2.DOAnchorPos(new Vector2(0, 0), 0.25f);
        OnBoard3.DOAnchorPos(new Vector2(1080, 0), 0.25f);
    }

    public void OnBoard3Next()
    {
        OnBoard3.DOAnchorPos(new Vector2(-1080, 0), 0.25f);
        OnBoard4.DOAnchorPos(new Vector2(0, 0), 0.25f);
    }

    public void OnBoard4Back()
        {
            OnBoard3.DOAnchorPos(new Vector2(0, 0), 0.25f);
            OnBoard4.DOAnchorPos(new Vector2(1080, 0), 0.25f);
        }
}
